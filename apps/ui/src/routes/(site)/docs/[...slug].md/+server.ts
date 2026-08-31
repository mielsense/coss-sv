import { generatedDocumentationRecords } from "@/server/generated-documentation.server.js";
import {
  createMarkdownDocument,
  findDocumentationRecord,
  textDocumentResponse,
} from "@/server/documentation-text.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ params }) => {
  const record = findDocumentationRecord(generatedDocumentationRecords, params.slug);
  if (!record) return new Response("Documentation page not found.\n", { status: 404 });
  return textDocumentResponse(createMarkdownDocument(record, params.slug));
};
