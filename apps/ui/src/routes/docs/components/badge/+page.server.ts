import { generatedDocumentationRecord } from "$lib/content/generated.server.js";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
  documentation: generatedDocumentationRecord("components/badge"),
})) satisfies PageServerLoad;
