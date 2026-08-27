import type { PreprocessorGroup } from "svelte/compiler";
import type { Plugin } from "unified";
import { documentationHeading } from "./headings.js";

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

export const documentationHeadings: Plugin = () => (tree) => {
  const root = tree as MarkdownNode;
  for (const node of root.children ?? []) {
    if (node.type !== "heading") continue;
    const heading = documentationHeading(nodeText(node));
    stripExplicitId(node);
    node.data = {
      ...node.data,
      hProperties: { ...node.data?.hProperties, id: heading.id },
    };
  }
};

export function documentationComponents(): PreprocessorGroup {
  return {
    name: "coss-sv-documentation-components",
    markup({ content, filename }) {
      if (!filename?.endsWith(".svx")) return;
      const scriptEnd = instanceScriptOpeningEnd(content);
      if (scriptEnd !== undefined) {
        return {
          code: `${content.slice(0, scriptEnd)}\n${componentImports}${content.slice(scriptEnd)}`,
          filename,
        };
      }
      const insertion = frontmatterEnd(content);
      return {
        code: `${content.slice(0, insertion)}\n<script lang="ts">\n${componentImports}\n</script>\n${content.slice(insertion)}`,
        filename,
      };
    },
  };
}
