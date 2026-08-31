import type { Component } from "svelte";
import {
  getParticlePreview,
  hasParticlePreview,
  type ParticlePreviewEntry,
} from "@/registry/particle-previews.js";
import Fixture from "@/preview/Fixture.svelte";

export {
  assertCompleteParticleInventory,
  compareParticleInventory,
  createParticlePreviewLoaderRegistry,
  defineParticleMeta,
  getParticleLinks,
  loadParticlePreview,
  particlePreviewLoaders,
} from "@/registry/particle-previews.js";
export type {
  InventoryReport,
  ParticleMeta,
  ParticleModule,
  ParticleModuleLoader,
  ParticlePreviewEntry,
  ParticlePreviewLoaderEntry,
  ParticlePreviewLoaderRegistry,
} from "@/registry/particle-previews.js";

export type PreviewEntry =
  | ({ kind: "particle" } & ParticlePreviewEntry)
  | { component: Component; kind: "component" | "fixture" };

type PreviewModule = { default: Component };
type PreviewModuleLoader = () => Promise<PreviewModule>;

const componentModules = import.meta.glob<PreviewModule>(
  "../../../../lib/parity/components/*.svelte",
);

function nameFromModulePath(path: string) {
  const filename = path.split("/").at(-1);
  if (!filename?.endsWith(".svelte")) {
    throw new Error(`Preview module path is not a Svelte file: ${path}`);
  }
  return filename.slice(0, -".svelte".length);
}

const supportPreviewLoaders: Readonly<Record<string, PreviewModuleLoader>> = Object.freeze({
  _fixture: async () => ({ default: Fixture }),
  ...Object.fromEntries(
    Object.entries(componentModules).map(([path, load]) => [nameFromModulePath(path), load]),
  ),
});

export function hasPreview(name: string): boolean {
  return hasParticlePreview(name) || name in supportPreviewLoaders;
}

export async function getPreview(name: string): Promise<PreviewEntry | undefined> {
  const particle = await getParticlePreview(name);
  if (particle) return { ...particle, kind: "particle" };

  const load = supportPreviewLoaders[name];
  if (!load) return undefined;
  return {
    component: (await load()).default,
    kind: name === "_fixture" ? "fixture" : "component",
  };
}
