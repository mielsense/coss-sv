import { generatedDocumentationRecords } from "@/server/generated-documentation.server.js";
import { createLlmsIndex, textDocumentResponse } from "@/server/documentation-text.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () =>
  textDocumentResponse(createLlmsIndex(generatedDocumentationRecords));
