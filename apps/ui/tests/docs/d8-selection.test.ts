import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Component } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");
const particleModules = import.meta.glob<{ default: Component }>(
  [
    "../../registry/default/particles/p-autocomplete-*.svelte",
    "../../registry/default/particles/p-combobox-*.svelte",
    "../../registry/default/particles/p-select-*.svelte",
    "../../registry/default/particles/p-command-*.svelte",
    "../../registry/default/particles/p-menu-*.svelte",
    "../../registry/default/particles/p-context-menu-*.svelte",
    "../../registry/default/particles/p-toolbar-*.svelte",
  ],
  { eager: true },
);
const expectedParticles = [
  ...Array.from({ length: 16 }, (_, index) => `p-autocomplete-${index + 1}`),
  ...Array.from({ length: 20 }, (_, index) => `p-combobox-${index + 1}`),
  ...Array.from({ length: 23 }, (_, index) => `p-select-${index + 1}`),
  ...Array.from({ length: 2 }, (_, index) => `p-command-${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `p-menu-${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `p-context-menu-${index + 1}`),
  "p-toolbar-1",
] as const;
const expectedPreviews = {
  autocomplete: [
    "p-autocomplete-1",
    "p-autocomplete-2",
    "p-autocomplete-3",
    "p-autocomplete-4",
    "p-autocomplete-5",
    "p-autocomplete-6",
    "p-autocomplete-7",
    "p-autocomplete-8",
    "p-autocomplete-9",
    "p-autocomplete-14",
    "p-autocomplete-10",
    "p-autocomplete-11",
    "p-autocomplete-12",
    "p-autocomplete-13",
  ],
  combobox: [
    "p-combobox-1",
    "p-combobox-2",
    "p-combobox-3",
    "p-combobox-4",
    "p-combobox-5",
    "p-combobox-6",
    "p-combobox-7",
    "p-combobox-8",
    "p-combobox-9",
    "p-combobox-13",
    "p-combobox-14",
    "p-combobox-10",
    "p-combobox-18",
    "p-combobox-11",
    "p-combobox-12",
  ],
  select: [
    "p-select-1",
    "p-select-2",
    "p-select-3",
    "p-select-4",
    "p-select-5",
    "p-select-6",
    "p-select-23",
    "p-select-7",
    "p-select-8",
    "p-select-9",
    "p-select-10",
    "p-combobox-18",
    "p-select-11",
  ],
  command: ["p-command-1"],
  menu: [
    "p-menu-1",
    "p-menu-2",
    "p-menu-3",
    "p-menu-9",
    "p-menu-4",
    "p-menu-5",
    "p-menu-6",
    "p-menu-7",
    "p-menu-8",
    "p-dialog-2",
  ],
  "context-menu": [
    "p-context-menu-1",
    "p-context-menu-2",
    "p-context-menu-3",
    "p-context-menu-4",
    "p-context-menu-5",
    "p-context-menu-6",
    "p-context-menu-7",
    "p-context-menu-8",
  ],
  toolbar: ["p-toolbar-1"],
} as const;
function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}
type Ownership = {
  ownership: Array<{
    componentImports: string[];
    implementationLane: string;
    particle: string;
    targetPath: string;
  }>;
};
describe("D8 selection, command, and menu documentation", () => {
  test("locks the exact 79-particle ownership set", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as Ownership;
    expect(
      ownership.ownership
        .filter((item) => item.implementationLane === "D8")
        .map((item) => item.particle)
        .sort(),
    ).toEqual([...expectedParticles].sort());
    expect(Object.keys(particleModules)).toHaveLength(79);
  });
  test.each(expectedParticles)("ports and server-renders %s with exact metadata", (id) => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as Ownership;
    const record = ownership.ownership.find((item) => item.particle === id);
    expect(record).toBeDefined();
    expect(existsSync(resolve(repositoryRoot, record?.targetPath ?? "missing"))).toBe(true);
    const particle = source(record?.targetPath ?? "missing");
    expect(particle).toContain(`id: "${id}"`);
    const declared = /components:\s*(\[[^\]]*\])/s.exec(particle)?.[1];
    expect([...(declared?.matchAll(/"([^"]+)"/g) ?? [])].map(([, name]) => name)).toEqual(
      record?.componentImports,
    );
    expect(particle).not.toMatch(
      /\b(?:export let|createEventDispatcher|className|onClick|useState|useEffect)\b|\bon:/,
    );
    expect(particle).not.toMatch(
      /(?:lucide(?:-react|-svelte)?|<svg\b|@base-ui\/react|from\s+["']react)/i,
    );
    const module = particleModules[`../../registry/default/particles/${id}.svelte`];
    expect(module).toBeDefined();
    expect(() => render(module?.default as Component)).not.toThrow();
  });
  test.each(Object.entries(expectedPreviews))(
    "keeps the exact %s page preview order",
    (slug, ids) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
      expect(page).not.toMatch(
        /\b(?:npm|npx|bun|bunx|yarn)\b|```(?:tsx|jsx)|@base-ui\/react|lucide|from ["']react/i,
      );
      expect([...page.matchAll(/<ComponentPreview\s+name="([^"]+)"/g)].map(([, id]) => id)).toEqual(
        ids,
      );
      expect(
        existsSync(
          resolve(repositoryRoot, `apps/ui/src/routes/docs/components/${slug}/+page.svelte`),
        ),
      ).toBe(true);
    },
  );
  test("uses the public Svelte namespaces and current Shards links", () => {
    for (const slug of Object.keys(expectedPreviews)) {
      const namespace = slug
        .split("-")
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join("");
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect(page).toContain(`<${namespace}.Root`);
      expect(page).toContain(
        `https://shardsui.com/svelte/${slug === "command" ? "autocomplete" : slug}`,
      );
    }
  });
});
