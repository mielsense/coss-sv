import type { Component } from "svelte";
import Fixture from "./_fixture.svelte";

type PreviewModule = { default: Component };
type PreviewRegistry = Readonly<Partial<Record<string, Component>>>;

const particleModules = import.meta.glob<PreviewModule>(
  "../../../../registry/default/particles/*.svelte",
  { eager: true },
);

function nameFromModulePath(path: string) {
  const filename = path.split("/").at(-1);
  if (!filename?.endsWith(".svelte")) {
    throw new Error(`Preview module path is not a Svelte file: ${path}`);
  }
  return filename.slice(0, -".svelte".length);
}

function createPreviewRegistry(): PreviewRegistry {
  const entries: Array<[string, Component]> = [["_fixture", Fixture]];

  for (const [path, module] of Object.entries(particleModules)) {
    entries.push([nameFromModulePath(path), module.default]);
  }

  const names = entries.map(([name]) => name);
  if (new Set(names).size !== names.length) {
    throw new Error("Preview registry contains duplicate names.");
  }

  return Object.freeze(Object.fromEntries(entries));
}

export const previewRegistry = createPreviewRegistry();

export function getPreview(name: string): Component | undefined {
  return previewRegistry[name];
}
