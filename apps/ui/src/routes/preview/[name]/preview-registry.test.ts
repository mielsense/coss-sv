import type { Component } from "svelte";
import { describe, expect, test } from "vitest";
import {
  assertCompleteParticleInventory,
  compareParticleInventory,
  createPreviewRegistry,
  defineParticleMeta,
  getParticleLinks,
  particlePreviewRegistry,
} from "./preview-registry.js";

const ComponentFixture = (() => undefined) as unknown as Component;

const buttonMeta = defineParticleMeta({
  components: ["button"],
  id: "p-button-1",
  interactive: true,
  responsive: false,
  title: "Basic button",
});

describe("typed particle preview registry", () => {
  test("discovers exact particle modules and preserves their upstream-derived metadata", () => {
    const registry = createPreviewRegistry({
      "../../../../registry/default/particles/p-button-1.svelte": {
        default: ComponentFixture,
        meta: buttonMeta,
      },
    });

    expect(registry["p-button-1"]).toEqual({
      component: ComponentFixture,
      meta: buttonMeta,
      modulePath: "../../../../registry/default/particles/p-button-1.svelte",
    });
    expect(Object.isFrozen(registry)).toBe(true);
    expect(Object.isFrozen(buttonMeta.components)).toBe(true);
  });

  test.each([
    [
      "a metadata id that differs from the module name",
      { ...buttonMeta, id: "p-button-2" },
      "Particle metadata id p-button-2 does not match module p-button-1",
    ],
    [
      "missing components",
      { ...buttonMeta, components: [] },
      "Particle p-button-1 must name at least one component",
    ],
    [
      "an invalid iframe height",
      { ...buttonMeta, iframeHeight: 0 },
      "Particle p-button-1 iframeHeight must be a positive integer",
    ],
  ])("rejects %s", (_label, meta, message) => {
    expect(() =>
      createPreviewRegistry({
        "../../../../registry/default/particles/p-button-1.svelte": {
          default: ComponentFixture,
          meta,
        },
      }),
    ).toThrow(message);
  });

  test("reports incomplete inventory without presenting missing particles as previews", () => {
    const report = compareParticleInventory(["p-button-1", "p-button-2"], {
      "p-button-1": {
        component: ComponentFixture,
        meta: buttonMeta,
        modulePath: "../../../../registry/default/particles/p-button-1.svelte",
      },
    });

    expect(report).toEqual({ complete: false, extra: [], missing: ["p-button-2"] });
    expect(() => assertCompleteParticleInventory(report)).toThrow(
      "Missing particle modules: p-button-2",
    );
  });

  test("keeps the live registry internally honest while documentation lanes are incomplete", () => {
    const ids = Object.keys(particlePreviewRegistry);
    const report = compareParticleInventory(ids, particlePreviewRegistry);

    expect(report).toEqual({ complete: true, extra: [], missing: [] });
    for (const [id, entry] of Object.entries(particlePreviewRegistry)) {
      expect(entry.meta.id).toBe(id);
    }
  });

  test("resolves source and shadcn-svelte install controls to the same item", () => {
    expect(getParticleLinks("p-button-1")).toEqual({
      installCommand:
        "pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/p-button-1.json",
      registryHref: "/r/p-button-1.json",
      sourceHref:
        "https://github.com/mielsense/coss-sv/blob/main/apps/ui/registry/default/particles/p-button-1.svelte",
    });
  });
});
