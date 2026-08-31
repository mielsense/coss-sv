import type { Component } from "svelte";
import {
  defineParticleMeta,
  type ParticleMeta,
  validateParticleMeta,
} from "./particle-metadata.js";

export type { ParticleMeta };
export { defineParticleMeta };

export type ParticleModule = {
  default: Component;
  meta: ParticleMeta;
};

export type ParticlePreviewEntry = {
  component: Component;
  meta: ParticleMeta;
  modulePath: string;
};

export type ParticleModuleLoader = () => Promise<ParticleModule>;

export type ParticlePreviewLoaderEntry = {
  load: ParticleModuleLoader;
  modulePath: string;
};

export type ParticlePreviewLoaderRegistry = Readonly<Record<string, ParticlePreviewLoaderEntry>>;

export type InventoryReport = {
  complete: boolean;
  extra: string[];
  missing: string[];
};

const particleModules = import.meta.glob<ParticleModule>(
  "../../../registry/default/particles/*.svelte",
);

function nameFromModulePath(path: string): string {
  const filename = path.split("/").at(-1);
  if (!filename?.endsWith(".svelte")) {
    throw new Error(`Preview module path is not a Svelte file: ${path}`);
  }
  return filename.slice(0, -".svelte".length);
}

export function createParticlePreviewLoaderRegistry(
  modules: Readonly<Record<string, ParticleModuleLoader>>,
): ParticlePreviewLoaderRegistry {
  const entries = Object.entries(modules).map(([modulePath, load]) => {
    const id = nameFromModulePath(modulePath);
    return [id, Object.freeze({ load, modulePath })] as const;
  });

  if (new Set(entries.map(([id]) => id)).size !== entries.length) {
    throw new Error("Preview registry contains duplicate names.");
  }

  return Object.freeze(Object.fromEntries(entries));
}

export async function loadParticlePreview(
  registry: ParticlePreviewLoaderRegistry,
  name: string,
): Promise<ParticlePreviewEntry | undefined> {
  const entry = registry[name];
  if (!entry) return undefined;

  const module = await entry.load();
  const meta = validateParticleMeta(module.meta);
  if (meta.id !== name) {
    throw new Error(`Particle metadata id ${meta.id} does not match module ${name}`);
  }
  return Object.freeze({ component: module.default, meta, modulePath: entry.modulePath });
}

export const particlePreviewLoaders = createParticlePreviewLoaderRegistry(particleModules);

export function hasParticlePreview(name: string): boolean {
  return name in particlePreviewLoaders;
}

export function getParticlePreview(name: string): Promise<ParticlePreviewEntry | undefined> {
  return loadParticlePreview(particlePreviewLoaders, name);
}

export function compareParticleInventory(
  expectedIds: readonly string[],
  registry: Readonly<Record<string, unknown>>,
): InventoryReport {
  const expected = new Set(expectedIds);
  const actual = new Set(Object.keys(registry));
  const missing = [...expected].filter((id) => !actual.has(id)).sort();
  const extra = [...actual].filter((id) => !expected.has(id)).sort();
  return { complete: missing.length === 0 && extra.length === 0, extra, missing };
}

export function assertCompleteParticleInventory(report: InventoryReport): void {
  if (report.missing.length > 0) {
    throw new Error(`Missing particle modules: ${report.missing.join(", ")}`);
  }
  if (report.extra.length > 0) {
    throw new Error(`Unexpected particle modules: ${report.extra.join(", ")}`);
  }
}

export function getParticleLinks(entry: ParticlePreviewEntry) {
  const { id } = entry.meta;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`Invalid particle id: ${id}`);
  }
  if (nameFromModulePath(entry.modulePath) !== id) {
    throw new Error(`Particle link id ${id} does not match module ${entry.modulePath}`);
  }
  const registryHref = `/r/${id}.json`;
  return Object.freeze({
    installCommand: `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app${registryHref}`,
    registryHref,
    sourceHref: `https://github.com/mielsense/coss-sv/blob/main/apps/ui/registry/default/particles/${id}.svelte`,
  });
}
