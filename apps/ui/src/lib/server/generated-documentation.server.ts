import generatedContent from "../../../.svelte-kit/generated/docs-content.json";
import type { ContentRecord } from "$lib/content/compiler.js";

type GeneratedContent = {
  pages: ContentRecord[];
  version: 1;
};

export const generatedDocumentationRecords = (generatedContent as GeneratedContent).pages;
