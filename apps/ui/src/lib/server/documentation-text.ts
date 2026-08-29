import type { ContentRecord } from "$lib/content/compiler.js";

export const documentationOrigin = "https://coss-sv.vercel.app";

const rootOrder = [
  "introduction",
  "get-started",
  "styling",
  "radix-migration",
  "skills",
  "changelog",
  "roadmap",
] as const;

const hookOrder = ["hooks-use-media-query", "hooks-use-copy-to-clipboard"] as const;

function recordSlug(record: ContentRecord): string {
  if (record.slug === "introduction") return "index";
  if (record.slug === "hooks-use-media-query") return "hooks/use-media-query";
  if (record.slug === "hooks-use-copy-to-clipboard") return "hooks/use-copy-to-clipboard";
  return record.slug;
}

function htmlPath(slug: string): string {
  return slug === "index" ? "/docs" : `/docs/${slug}`;
}

function markdownUrl(slug: string): string {
  return `${documentationOrigin}/docs/${slug}.md`;
}

function orderedRecords(records: readonly ContentRecord[]): ContentRecord[] {
  const bySlug = new Map(records.map((record) => [record.slug, record]));
  const selected = new Set<string>();
  const ordered: ContentRecord[] = [];

  for (const slug of rootOrder) {
    const record = bySlug.get(slug);
    if (record) {
      selected.add(slug);
      ordered.push(record);
    }
  }
  for (const record of records) {
    if (record.kind === "component" && !selected.has(record.slug)) {
      selected.add(record.slug);
      ordered.push(record);
    }
  }
  for (const slug of hookOrder) {
    const record = bySlug.get(slug);
    if (record) {
      selected.add(slug);
      ordered.push(record);
    }
  }
  for (const record of records) {
    if (!selected.has(record.slug)) ordered.push(record);
  }
  return ordered;
}

function indexLine(record: ContentRecord): string {
  const slug = recordSlug(record);
  return `- [${record.metadata.title}](${markdownUrl(slug)}): ${record.metadata.description}`;
}

export function findDocumentationRecord(
  records: readonly ContentRecord[],
  publicSlug: string,
): ContentRecord | undefined {
  const normalized = publicSlug.replace(/^\/+|\/+$/g, "");
  return records.find((record) => {
    const slug = recordSlug(record);
    return slug === normalized || (slug === "index" && normalized === "introduction");
  });
}

export function createMarkdownDocument(
  record: ContentRecord,
  publicSlug = recordSlug(record),
): string {
  const canonicalSlug = publicSlug === "introduction" ? "index" : publicSlug;
  const body = record.markdown
    .replace(/^\s*<CopyMarkdownButton\b[^>]*\/>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const title = /^#\s+/m.test(body) ? "" : `# ${record.metadata.title}\n\n`;
  return `${title}> ${record.metadata.description}\n\n[Canonical documentation](${documentationOrigin}${htmlPath(canonicalSlug)})\n\n${body}\n`;
}

export function createLlmsIndex(records: readonly ContentRecord[]): string {
  const ordered = orderedRecords(records);
  const overview = ordered.filter((record) => rootOrder.includes(record.slug as never));
  const components = ordered.filter((record) => record.kind === "component");
  const hooks = ordered.filter((record) => hookOrder.includes(record.slug as never));

  return `# COSS for Svelte

**COSS for Svelte** is an unofficial Svelte 5 port of COSS UI. It uses Shards UI for headless
behavior, Tailwind CSS for styling, and the shadcn-svelte CLI for registry installation.

Unofficial Svelte port made by Miel: https://github.com/mielsense

## Overview

${overview.map(indexLine).join("\n")}

## Components

${components.map(indexLine).join("\n")}

## Svelte patterns

${hooks.map(indexLine).join("\n")}
`;
}

export function createLlmsFullText(records: readonly ContentRecord[]): string {
  const documents = orderedRecords(records)
    .map((record) => {
      const slug = recordSlug(record);
      return `## Document: ${record.metadata.title}\n\n${createMarkdownDocument(record, slug)}`;
    })
    .join("\n\n---\n\n");
  return `${createLlmsIndex(records)}\n\n---\n\n# Full documentation\n\n${documents}`;
}

export function textDocumentResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
