import generatedContent from "../../../.svelte-kit/generated/docs-index.json";
import type { DocumentationPageData } from "./compiler.js";

type GeneratedIndexRecord = DocumentationPageData & { slug: string };

type GeneratedContent = {
  pages: GeneratedIndexRecord[];
  version: 1;
};

const generated = generatedContent as GeneratedContent;

export function findGeneratedDocumentationRecord(slug: string): DocumentationPageData | undefined {
  const record = generated.pages.find((page) => page.slug === slug);
  return record
    ? { metadata: record.metadata, tableOfContents: record.tableOfContents }
    : undefined;
}
