import generatedContent from "../../../.svelte-kit/generated/docs-content.json";
import type { ContentRecord } from "./compiler.js";

type GeneratedContent = {
  pages: ContentRecord[];
  version: 1;
};

const generated = generatedContent as GeneratedContent;

export function generatedDocumentationRecord(slug: string): ContentRecord {
  const record = generated.pages.find((page) => page.slug === slug);
  if (!record) throw new Error(`missing generated documentation record ${slug}`);
  return record;
}
