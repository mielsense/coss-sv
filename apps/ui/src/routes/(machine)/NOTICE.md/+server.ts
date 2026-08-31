import { legalDocumentResponse, legalDocuments } from "@/server/legal-documents.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => legalDocumentResponse(legalDocuments.notice);
