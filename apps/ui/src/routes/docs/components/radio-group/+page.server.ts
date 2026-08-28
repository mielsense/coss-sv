import { generatedDocumentationRecord } from "$lib/content/generated.server.js";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
  documentation: generatedDocumentationRecord("components/radio-group"),
})) satisfies PageServerLoad;
