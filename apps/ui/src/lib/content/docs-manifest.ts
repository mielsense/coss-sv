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
  { id: "components/alert-dialog" },
  { id: "components/breadcrumb" },
  { id: "components/button" },
  { id: "components/calendar" },
  { id: "components/card" },
  { id: "components/checkbox" },
  { id: "components/checkbox-group" },
  { id: "components/collapsible" },
  { id: "components/dialog" },
  { id: "components/drawer" },
  { id: "components/date-picker" },
  { id: "components/empty" },
  { id: "components/frame" },
  { id: "components/pagination" },
  { id: "components/preview-card" },
  { id: "components/radio-group" },
  { id: "components/scroll-area" },
  { id: "components/separator" },
  { id: "components/segmented-control" },
  { id: "components/sheet" },
  { id: "components/skeleton" },
  { id: "components/slider" },
  { id: "components/switch" },
  { id: "components/table" },
  { id: "components/tabs" },
  { id: "components/toggle" },
  { id: "components/toggle-group" },
  { id: "components/tooltip" },
]);
