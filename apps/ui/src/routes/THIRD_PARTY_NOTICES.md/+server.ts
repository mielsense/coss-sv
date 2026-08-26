import { legalDocumentResponse, legalDocuments } from "$lib/server/legal-documents.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => legalDocumentResponse(legalDocuments.thirdPartyNotices);
