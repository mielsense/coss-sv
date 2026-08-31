import { error } from "@sveltejs/kit";
import { hasPreview } from "./preview-registry.js";

export function resolvePreviewPage(name: string): { name: string } {
  if (!hasPreview(name)) error(404, `Preview ${name} was not found.`);
  return { name };
}
