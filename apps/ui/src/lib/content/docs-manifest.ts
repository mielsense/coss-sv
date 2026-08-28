export type DocsManifestEntry = {
  id: string;
};

export function defineDocsManifest<const Entries extends readonly DocsManifestEntry[]>(
  entries: Entries,
): Entries {
  return entries;
}

export const docsManifest = defineDocsManifest([
  { id: "components/accordion" },
  { id: "components/card" },
  { id: "components/collapsible" },
  { id: "components/empty" },
  { id: "components/frame" },
  { id: "components/separator" },
  { id: "components/skeleton" },
]);
