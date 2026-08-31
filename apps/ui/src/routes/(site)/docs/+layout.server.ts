import { findGeneratedDocumentationRecord } from "@/content/generated.server.js";
import type { LayoutServerLoad } from "./$types";

function documentationSlug(pathname: string): string {
  const route = pathname.replace(/^\/docs\/?/, "").replace(/\/$/, "");
  if (!route) return "introduction";
  return route.startsWith("hooks/") ? `hooks-${route.slice("hooks/".length)}` : route;
}

export const load = (({ url }) => ({
  documentation: findGeneratedDocumentationRecord(documentationSlug(url.pathname)),
})) satisfies LayoutServerLoad;
