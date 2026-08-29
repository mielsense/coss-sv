import { generatedDocumentationRecords } from "$lib/server/generated-documentation.server.js";
import { createLlmsIndex, textDocumentResponse } from "$lib/server/documentation-text.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () =>
  textDocumentResponse(createLlmsIndex(generatedDocumentationRecords));
