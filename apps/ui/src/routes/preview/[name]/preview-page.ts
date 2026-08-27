import { error } from "@sveltejs/kit";
import { getPreview } from "./preview-registry.js";

export function resolvePreviewPage(name: string): { name: string } {
  if (!getPreview(name)) error(404, `Preview ${name} was not found.`);
  return { name };
}
