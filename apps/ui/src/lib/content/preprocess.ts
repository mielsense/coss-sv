import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PreprocessorGroup } from "svelte/compiler";
import type { Plugin } from "unified";
import { createDocumentationHeadingSlugger } from "./headings.js";
import { withoutFencedCode } from "./markdown.js";
import { createParticleSourceLoader, type ParticleSourceLoader } from "./particle-source.js";

export const documentationComponentNames = [
  "ApiTable",
  "Callout",
  "CodeSource",
  "ComponentPreview",
  "ComponentStatus",
  "FileTree",
  "InstallCommand",
  "LinkedHeading",
  "PageNavigation",
] as const;

type MarkdownNode = {
  children?: MarkdownNode[];
  data?: {
    hProperties?: Record<string, unknown>;
  };
  type: string;
  value?: string;
};

const componentImports = `import { ${documentationComponentNames.join(", ")} } from "$lib/content/components";`;
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

export type DocumentationComponentsOptions = {
  loadParticleSource?: ParticleSourceLoader;
};

function frontmatterEnd(content: string): number {
  return /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(content)?.[0].length ?? 0;
}

function instanceScriptOpeningEnd(content: string): number | undefined {
  let fencedBy: "```" | "~~~" | undefined;
  let offset = frontmatterEnd(content);

  for (const line of content.slice(offset).match(/.*(?:\r?\n|$)/g) ?? []) {
    const fence = /^\s*(```|~~~)/.exec(line)?.[1] as "```" | "~~~" | undefined;
    if (fence) {
      if (!fencedBy) fencedBy = fence;
      else if (fencedBy === fence) fencedBy = undefined;
      offset += line.length;
      continue;
    }
    if (!fencedBy) {
      const opening = /^\s*<script\b([^>]*)>/.exec(line);
      if (opening) {
        const attributes = opening[1] ?? "";
        const moduleScript =
          /(?:^|\s)module(?:\s|$)/.test(attributes) ||
          /\bcontext\s*=\s*["']module["']/.test(attributes);
        if (!moduleScript) return offset + (opening.index ?? 0) + opening[0].length;
      }
    }
    offset += line.length;
  }
}

function nodeText(node: MarkdownNode): string {
  if (typeof node.value === "string") return node.value;
  return node.children?.map(nodeText).join("") ?? "";
}

function stripExplicitId(node: MarkdownNode): void {
  const children = node.children ?? [];
  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];
    if (!child) continue;
    if (typeof child.value === "string") {
      child.value = child.value.replace(/\s+\{#[^}]+\}\s*$/, "");
      return;
    }
    if (child.children?.length) {
      stripExplicitId(child);
      return;
    }
  }
}

function serializeForScript(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

export const documentationHeadings: Plugin = () => (tree) => {
  const root = tree as MarkdownNode;
  const slugger = createDocumentationHeadingSlugger();
  for (const node of root.children ?? []) {
    if (node.type !== "heading") continue;
    const heading = slugger.heading(nodeText(node));
    stripExplicitId(node);
    node.data = {
      ...node.data,
      hProperties: { ...node.data?.hProperties, id: heading.id },
    };
  }
};

async function injectPreviewSources(
  content: string,
  loadParticleSource: ParticleSourceLoader,
): Promise<{ declarations: string[]; source: string }> {
  const masked = withoutFencedCode(content);
  const matches = [...masked.matchAll(/<ComponentPreview\b([^>]*)\/>/g)];
  const sources = new Map<string, { declaration: string; variable: string }>();
  const replacements: Array<{ end: number; start: number; value: string }> = [];

  for (const match of matches) {
    const attributes = match[1] ?? "";
    const id = /\bname=["']([^"']+)["']/.exec(attributes)?.[1];
    if (!id) throw new Error("ComponentPreview is missing its particle name");
    if (/\bsource\s*=/.test(attributes)) {
      throw new Error(`ComponentPreview source for ${id} is compiler-owned`);
    }

    let source = sources.get(id);
    if (!source) {
      const variable = `__cossParticleSource${sources.size}`;
      source = {
        declaration: `const ${variable} = ${serializeForScript(await loadParticleSource(id))};`,
        variable,
      };
      sources.set(id, source);
    }

    const start = match.index ?? 0;
    const original = content.slice(start, start + match[0].length);
    replacements.push({
      end: start + match[0].length,
      start,
      value: original.replace(/\s*\/>$/, ` source={${source.variable}} />`),
    });
  }

  let transformed = content;
  for (const replacement of replacements.reverse()) {
    transformed = `${transformed.slice(0, replacement.start)}${replacement.value}${transformed.slice(replacement.end)}`;
  }
  return {
    declarations: [...sources.values()].map(({ declaration }) => declaration),
    source: transformed,
  };
}

export function documentationComponents(
  options: DocumentationComponentsOptions = {},
): PreprocessorGroup {
  const loadParticleSource =
    options.loadParticleSource ??
    createParticleSourceLoader(resolve(appRoot, "registry/default/particles"));

  return {
    name: "coss-sv-documentation-components",
    async markup({ content, filename }) {
      if (!filename?.endsWith(".svx")) return;
      const injected = await injectPreviewSources(content, loadParticleSource);
      const declarations = injected.declarations.length
        ? `\n${injected.declarations.join("\n")}`
        : "";
      const scriptEnd = instanceScriptOpeningEnd(injected.source);
      if (scriptEnd !== undefined) {
        return {
          code: `${injected.source.slice(0, scriptEnd)}\n${componentImports}${declarations}${injected.source.slice(scriptEnd)}`,
          filename,
        };
      }
      const insertion = frontmatterEnd(injected.source);
      return {
        code: `${injected.source.slice(0, insertion)}\n<script lang="ts">\n${componentImports}${declarations}\n</script>\n${injected.source.slice(insertion)}`,
        filename,
      };
    },
  };
}

export function modernizeDocumentationOutput(): PreprocessorGroup {
  return {
    name: "coss-sv-modern-documentation-output",
    markup({ content, filename }) {
      if (!filename?.endsWith(".svx")) return;
      return {
        code: content.replaceAll('<script context="module">', "<script module>"),
        filename,
      };
    },
  };
}
