import generatedContent from "../../../.svelte-kit/generated/docs-content.json";
import type { GeneratedContentRecord } from "@/content/compiler.js";

type GeneratedContent = {
  pages: GeneratedContentRecord[];
  version: 1;
};

export const generatedDocumentationRecords = (generatedContent as GeneratedContent).pages;
