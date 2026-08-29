import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { HugeiconsIcon } from "@coss-sv/ui";
import { Add01Icon } from "@hugeicons/core-free-icons";
import type { Component } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../../..");

const clientRevealedIconParticles = new Set(["p-popover-2", "p-preview-card-1", "p-skeleton-1"]);

const ownedParticles = [
  "p-button-13",
  "p-button-14",
  "p-button-15",
  "p-button-16",
  "p-button-19",
  "p-button-20",
  "p-button-21",
  "p-button-22",
  "p-button-23",
  "p-button-24",
  "p-button-26",
  "p-button-27",
  "p-button-30",
  "p-button-31",
  "p-button-35",
  "p-button-36",
  "p-button-37",
  "p-button-38",
  "p-button-39",
  "p-button-40",
  "p-card-1",
  "p-card-3",
  "p-card-4",
  "p-card-6",
  "p-card-7",
  "p-card-8",
  "p-card-10",
  "p-card-11",
  "p-collapsible-1",
  "p-drawer-13",
  "p-empty-1",
  "p-frame-2",
  "p-popover-2",
  "p-popover-3",
  "p-popover-4",
  "p-preview-card-1",
  "p-skeleton-1",
  "p-slider-11",
  "p-slider-14",
  "p-slider-21",
  "p-switch-7",
  "p-switch-8",
  "p-switch-9",
  "p-tabs-6",
  "p-tabs-7",
  "p-tabs-8",
  "p-tabs-9",
  "p-tabs-11",
  "p-tabs-12",
  "p-tabs-13",
  "p-toggle-3",
  "p-toggle-7",
  "p-toggle-8",
  "p-toggle-group-1",
  "p-toggle-group-2",
  "p-toggle-group-3",
  "p-toggle-group-4",
  "p-toggle-group-5",
  "p-toggle-group-6",
  "p-toggle-group-7",
  "p-toggle-group-8",
  "p-toggle-group-9",
  "p-tooltip-2",
  "p-tooltip-3",
  "p-tooltip-4",
] as const;

const particleModules = import.meta.glob<{ default: Component }>(
  [
    "../../registry/default/particles/p-button-{13,14,15,16,19,20,21,22,23,24,26,27,30,31,35,36,37,38,39,40}.svelte",
    "../../registry/default/particles/p-card-{1,3,4,6,7,8,10,11}.svelte",
    "../../registry/default/particles/p-collapsible-1.svelte",
    "../../registry/default/particles/p-drawer-13.svelte",
    "../../registry/default/particles/p-empty-1.svelte",
    "../../registry/default/particles/p-frame-2.svelte",
    "../../registry/default/particles/p-popover-{2,3,4}.svelte",
    "../../registry/default/particles/p-preview-card-1.svelte",
    "../../registry/default/particles/p-skeleton-1.svelte",
    "../../registry/default/particles/p-slider-{11,14,21}.svelte",
    "../../registry/default/particles/p-switch-{7,8,9}.svelte",
    "../../registry/default/particles/p-tabs-{6,7,8,9,11,12,13}.svelte",
    "../../registry/default/particles/p-toggle-{3,7,8}.svelte",
    "../../registry/default/particles/p-toggle-group-{1,2,3,4,5,6,7,8,9}.svelte",
    "../../registry/default/particles/p-tooltip-{2,3,4}.svelte",
  ],
  { eager: true },
);

function particleSource(id: string): string {
  return readFileSync(
    resolve(repositoryRoot, `apps/ui/registry/default/particles/${id}.svelte`),
    "utf8",
  );
}

describe("owned registry particle Hugeicons renderer migration", () => {
  test("locks the exact 65-particle ownership set", () => {
    expect(ownedParticles).toHaveLength(65);
    expect(Object.keys(particleModules).sort()).toEqual(
      ownedParticles.map((id) => `../../registry/default/particles/${id}.svelte`).sort(),
    );
  });

  test("server-renders core icon geometry through the central renderer", () => {
    const body = render(HugeiconsIcon, {
      props: { icon: Add01Icon, strokeWidth: 2 },
    }).body;
    expect(body).toContain("<svg");
    expect(body).toContain('stroke-width="2"');
    expect(body).toMatch(/<(?:path|circle|ellipse|rect)\b/);
  });

  test.each(ownedParticles)("server-renders %s through the central icon renderer", (id) => {
    const source = particleSource(id);
    expect(source).not.toContain("@hugeicons/svelte");
    expect(source).toContain("@hugeicons/core-free-icons");
    expect(source).toMatch(
      /import\s*\{[\s\S]*?\bHugeiconsIcon\b[\s\S]*?\}\s*from\s*["']@coss-sv\/ui["'];/,
    );

    const iconElements = source.match(/<HugeiconsIcon\b[\s\S]*?\/>/g) ?? [];
    expect(iconElements.length).toBeGreaterThan(0);
    for (const iconElement of iconElements) {
      expect(iconElement).toContain("strokeWidth={2}");
    }

    const module = particleModules[`../../registry/default/particles/${id}.svelte`];
    expect(module).toBeDefined();
    const body = render(module?.default as Component).body;
    if (clientRevealedIconParticles.has(id)) {
      expect(body).not.toContain("<svg");
      return;
    }
    expect(body).toContain("<svg");
    expect(body).toContain('stroke-width="2"');
    expect(body).toMatch(/<(?:path|circle|ellipse|rect)\b/);
  });
});
