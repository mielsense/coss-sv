import { resolve } from "node:path";
import type { PreprocessorGroup } from "svelte/compiler";
import type { Plugin } from "unified";
import { loadRegistryComponentSource } from "../server/registry-component-source.js";
import { createFilesystemRegistryDocumentLoader } from "../server/registry-source-filesystem.js";
import { createDocumentationHeadingSlugger } from "./headings.js";
import { withoutFencedCode } from "./markdown.js";

export const documentationComponentNames = [
  "ApiTable",
  "Callout",
  "CodeSource",
  "ComponentPreview",
  "ComponentStatus",
  "CopyButton",
  "CopyMarkdownButton",
  "DocsTable",
  "EarlyAccessCallout",
  "FileTree",
  "InstallCommand",
  "LinkedHeading",
  "MediaQueryDemo",
  "PageNavigation",
] as const;

type MarkdownNode = {
  children?: MarkdownNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
  depth?: number;
  type: string;
  value?: string;
};

const componentImports = `import { ${documentationComponentNames.join(", ")} } from "@/content/components";`;
const loadRegistryDocument = createFilesystemRegistryDocumentLoader(
  resolve(import.meta.dirname, "../../../static/r"),
);

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
    if (node.type === "table") {
      node.data = { ...node.data, hName: "DocsTable" };
      continue;
    }
    if (node.type !== "heading") continue;
    const heading = slugger.heading(nodeText(node));
    stripExplicitId(node);
    node.data = {
      ...node.data,
      ...(node.depth && node.depth >= 2 && node.depth <= 3 ? { hName: "LinkedHeading" } : {}),
      hProperties: { ...node.data?.hProperties, id: heading.id },
    };
    if (node.data.hName === "LinkedHeading") {
      node.data.hProperties = { ...node.data.hProperties, level: node.depth };
    }
  }
};

function injectPreviewLoaders(content: string): { declarations: string[]; source: string } {
  const masked = withoutFencedCode(content);
  const matches = [...masked.matchAll(/<ComponentPreview\b((?:[^>"']|"[^"]*"|'[^']*')*?)\s*\/>/g)];
  const declarations: string[] = [];
  const replacements: Array<{ end: number; start: number; value: string }> = [];
  const variables = new Map<string, string>();

  for (const match of matches) {
    const attributes = match[1] ?? "";
    const id = /\bname=["']([^"']+)["']/.exec(attributes)?.[1];
    if (!id) throw new Error("ComponentPreview is missing its particle name");
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
      throw new Error(`ComponentPreview has an invalid particle name: ${id}`);
    }
    if (/\bsource\s*=/.test(attributes)) {
      throw new Error(`ComponentPreview source for ${id} is compiler-owned`);
    }
    if (/\bcomponent\s*=/.test(attributes)) {
      throw new Error(`ComponentPreview component for ${id} is compiler-owned`);
    }
    if (/\bloader\s*=/.test(attributes)) {
      throw new Error(`ComponentPreview loader for ${id} is compiler-owned`);
    }

    let variable = variables.get(id);
    if (!variable) {
      variable = `__cossParticleLoader${variables.size}`;
      variables.set(id, variable);
      declarations.push(`const ${variable} = () => import("$particles/${id}.svelte");`);
    }

    const start = match.index ?? 0;
    const original = content.slice(start, start + match[0].length);
    replacements.push({
      end: start + match[0].length,
      start,
      value: original.replace(/\s*\/>$/, ` loader={${variable}} />`),
    });
  }

  let transformed = content;
  for (const replacement of replacements.reverse()) {
    transformed = `${transformed.slice(0, replacement.start)}${replacement.value}${transformed.slice(replacement.end)}`;
  }

  return { declarations, source: transformed };
}

async function injectInstallSources(
  content: string,
): Promise<{ declarations: string[]; source: string }> {
  const masked = withoutFencedCode(content);
  const matches = [...masked.matchAll(/<InstallCommand\b([\s\S]*?)\/>/g)];
  const replacements: Array<{ end: number; start: number; value: string }> = [];

  for (const match of matches) {
    const attributes = match[1] ?? "";
    if (/\bfiles\s*=/.test(attributes)) {
      throw new Error("InstallCommand component source is compiler-owned");
    }
    const components = [...attributes.matchAll(/\/r\/([a-z0-9-]+)\.json/g)].flatMap((urlMatch) =>
      urlMatch[1] ? [urlMatch[1]] : [],
    );
    if (components.length === 0) {
      throw new Error("InstallCommand is missing a component registry URL");
    }
    const start = match.index ?? 0;
    const original = content.slice(start, start + match[0].length);
    replacements.push({
      end: start + match[0].length,
      start,
      value: original.replace(/\s*\/>$/, ` registryNames={${serializeForScript(components)}} />`),
    });
  }

  let transformed = content;
  for (const replacement of replacements.reverse()) {
    transformed = `${transformed.slice(0, replacement.start)}${replacement.value}${transformed.slice(replacement.end)}`;
  }
  return {
    declarations: [],
    source: transformed,
  };
}

async function injectInlineComponentSources(
  content: string,
): Promise<{ declarations: string[]; source: string }> {
  const masked = withoutFencedCode(content);
  const matches = [...masked.matchAll(/<ComponentSource\b((?:[^>"']|"[^"]*"|'[^']*')*?)\s*\/>/g)];
  const declarations: string[] = [];
  const replacements: Array<{ end: number; start: number; value: string }> = [];

  for (const [index, match] of matches.entries()) {
    const attributes = match[1] ?? "";
    const component = /\bname=["']([^"']+)["']/.exec(attributes)?.[1];
    const title = /\btitle=["']([^"']+)["']/.exec(attributes)?.[1];
    if (!component || !title) {
      throw new Error("ComponentSource requires name and title attributes");
    }
    const source = await loadRegistryComponentSource([component], loadRegistryDocument);
    const file = source.files.find(({ path }) => path === title);
    if (!file) {
      throw new Error(`ComponentSource ${component} does not contain ${title}`);
    }
    const variable = `__cossInlineComponentSource${index}`;
    declarations.push(`const ${variable} = ${serializeForScript(file.source)};`);
    const start = match.index ?? 0;
    replacements.push({
      end: start + match[0].length,
      start,
      value: `<CodeSource source={${variable}} title=${serializeForScript(title)} />`,
    });
  }

  let transformed = content;
  for (const replacement of replacements.reverse()) {
    transformed = `${transformed.slice(0, replacement.start)}${replacement.value}${transformed.slice(replacement.end)}`;
  }
  return { declarations, source: transformed };
}

export function documentationComponents(): PreprocessorGroup {
  return {
    name: "coss-sv-documentation-components",
    async markup({ content, filename }) {
      if (!filename?.endsWith(".svx")) return;
      const previews = injectPreviewLoaders(content);
      const installs = await injectInstallSources(previews.source);
      const inlineSources = await injectInlineComponentSources(installs.source);
      const injectedDeclarations = [
        ...previews.declarations,
        ...installs.declarations,
        ...inlineSources.declarations,
      ];
      const declarations = injectedDeclarations.length
        ? `\n${injectedDeclarations.join("\n")}`
        : "";
      const scriptEnd = instanceScriptOpeningEnd(inlineSources.source);
      if (scriptEnd !== undefined) {
        return {
          code: `${inlineSources.source.slice(0, scriptEnd)}\n${componentImports}${declarations}${inlineSources.source.slice(scriptEnd)}`,
          filename,
        };
      }
      const insertion = frontmatterEnd(inlineSources.source);
      return {
        code: `${inlineSources.source.slice(0, insertion)}\n<script lang="ts">\n${componentImports}${declarations}\n</script>\n${inlineSources.source.slice(insertion)}`,
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
