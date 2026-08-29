import { generatedDocumentationRecords } from "$lib/server/generated-documentation.server.js";
import { createLlmsFullText, textDocumentResponse } from "$lib/server/documentation-text.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () =>
  textDocumentResponse(createLlmsFullText(generatedDocumentationRecords));
