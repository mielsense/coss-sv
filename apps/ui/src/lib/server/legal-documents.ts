import license from "../../../../../LICENSE?raw";
import notice from "../../../../../NOTICE.md?raw";
import thirdPartyNotices from "../../../../../THIRD_PARTY_NOTICES.md?raw";

export const legalDocuments = {
  license,
  notice,
  thirdPartyNotices,
} as const;

export function legalDocumentResponse(document: string): Response {
  return new Response(document, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
