import type { Component } from "svelte";
import {
  defineParticleMeta,
  type ParticleMeta,
  validateParticleMeta,
} from "$lib/registry/particle-metadata.js";
import Fixture from "./_fixture.svelte";

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

export type ParticlePreviewRegistry = Readonly<Record<string, ParticlePreviewEntry>>;

export type InventoryReport = {
  complete: boolean;
  extra: string[];
  missing: string[];
};

export type PreviewEntry =
  | ({ kind: "particle" } & ParticlePreviewEntry)
  | { component: Component; kind: "component" | "fixture" };

type PreviewModule = { default: Component };

const particleModules = import.meta.glob<ParticleModule>(
  "../../../../registry/default/particles/*.svelte",
  { eager: true },
);
const componentModules = import.meta.glob<PreviewModule>(
  "../../../lib/parity/components/*.svelte",
  { eager: true },
);

function nameFromModulePath(path: string) {
  const filename = path.split("/").at(-1);
  if (!filename?.endsWith(".svelte")) {
    throw new Error(`Preview module path is not a Svelte file: ${path}`);
  }
  return filename.slice(0, -".svelte".length);
}

export function createPreviewRegistry(
  modules: Readonly<Record<string, ParticleModule>>,
): ParticlePreviewRegistry {
  const entries = Object.entries(modules).map(([modulePath, module]) => {
    const id = nameFromModulePath(modulePath);
    const meta = validateParticleMeta(module.meta);
    if (meta.id !== id) {
      throw new Error(`Particle metadata id ${meta.id} does not match module ${id}`);
    }
    return [id, Object.freeze({ component: module.default, meta, modulePath })] as const;
  });

  if (new Set(entries.map(([id]) => id)).size !== entries.length) {
    throw new Error("Preview registry contains duplicate names.");
  }

  return Object.freeze(Object.fromEntries(entries));
}

export const particlePreviewRegistry = createPreviewRegistry(particleModules);

const supportPreviewRegistry: Readonly<Record<string, PreviewEntry>> = Object.freeze({
  _fixture: { component: Fixture, kind: "fixture" },
  ...Object.fromEntries(
    Object.entries(componentModules).map(([path, module]) => [
      nameFromModulePath(path),
      { component: module.default, kind: "component" as const },
    ]),
  ),
});

export function getPreview(name: string): PreviewEntry | undefined {
  const particle = (particlePreviewRegistry as Partial<Record<string, ParticlePreviewEntry>>)[name];
  if (particle) return { ...particle, kind: "particle" };
  return supportPreviewRegistry[name];
}

export function compareParticleInventory(
  expectedIds: readonly string[],
  registry: ParticlePreviewRegistry,
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

export function getParticleLinks(id: string) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`Invalid particle id: ${id}`);
  }
  const registryHref = `/r/${id}.json`;
  return Object.freeze({
    installCommand: `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app${registryHref}`,
    registryHref,
    sourceHref: `https://github.com/mielsense/coss-sv/blob/main/apps/ui/registry/default/particles/${id}.svelte`,
  });
}
