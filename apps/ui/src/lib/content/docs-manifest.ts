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
  { id: "components/button" },
  { id: "components/card" },
  { id: "components/checkbox" },
  { id: "components/checkbox-group" },
  { id: "components/collapsible" },
  { id: "components/empty" },
  { id: "components/frame" },
  { id: "components/radio-group" },
  { id: "components/separator" },
  { id: "components/skeleton" },
  { id: "components/slider" },
  { id: "components/switch" },
  { id: "components/toggle" },
  { id: "components/toggle-group" },
]);
