import { generatedDocumentationRecords } from "@/server/generated-documentation.server.js";
import { createLlmsFullText, textDocumentResponse } from "@/server/documentation-text.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () =>
  textDocumentResponse(createLlmsFullText(generatedDocumentationRecords));
