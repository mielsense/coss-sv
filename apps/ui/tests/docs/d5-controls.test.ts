import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const compiledParticles = import.meta.glob(
  [
    "../../registry/default/particles/p-button-*.svelte",
    "../../registry/default/particles/p-checkbox-*.svelte",
    "../../registry/default/particles/p-checkbox-group-*.svelte",
    "../../registry/default/particles/p-radio-group-*.svelte",
    "../../registry/default/particles/p-slider-*.svelte",
    "../../registry/default/particles/p-switch-*.svelte",
    "../../registry/default/particles/p-toggle-*.svelte",
    "../../registry/default/particles/p-toggle-group-*.svelte",
  ],
  { eager: true },
);

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");

type OwnershipFile = {
  ownership: Array<{
    componentImports: string[];
    implementationLane: string;
    particle: string;
    targetPath: string;
  }>;
};

const buttonIds = [
  ...Array.from({ length: 24 }, (_, index) => `p-button-${index + 1}`),
  ...Array.from({ length: 16 }, (_, index) => `p-button-${index + 26}`),
] as const;
const expectedParticles = [
  ...buttonIds,
  ...Array.from({ length: 5 }, (_, index) => `p-checkbox-${index + 1}`),
  ...Array.from({ length: 5 }, (_, index) => `p-checkbox-group-${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `p-radio-group-${index + 1}`),
  ...Array.from({ length: 23 }, (_, index) => `p-slider-${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `p-switch-${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `p-toggle-${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `p-toggle-group-${index + 1}`),
] as const;

const expectedPagePreviews = {
  button: [
    "p-button-1",
    "p-button-1",
    "p-button-2",
    "p-button-3",
    "p-button-4",
    "p-button-5",
    "p-button-6",
    "p-button-7",
    "p-button-8",
    "p-button-9",
    "p-button-10",
    "p-button-11",
    "p-button-12",
    "p-button-13",
    "p-button-14",
    "p-button-15",
    "p-button-16",
    "p-button-17",
    "p-button-41",
    "p-button-18",
  ],
  checkbox: ["p-checkbox-1", "p-checkbox-2", "p-checkbox-3", "p-checkbox-4", "p-checkbox-5"],
  "checkbox-group": [
    "p-checkbox-group-1",
    "p-checkbox-group-2",
    "p-checkbox-group-3",
    "p-checkbox-group-4",
    "p-checkbox-group-5",
  ],
  "radio-group": [
    "p-radio-group-1",
    "p-radio-group-2",
    "p-radio-group-3",
    "p-radio-group-4",
    "p-radio-group-5",
  ],
  slider: ["p-slider-1", "p-slider-2", "p-slider-3", "p-slider-4", "p-slider-5"],
  switch: ["p-switch-1", "p-switch-2", "p-switch-3", "p-switch-6", "p-switch-4", "p-switch-5"],
  toggle: [
    "p-toggle-1",
    "p-toggle-2",
    "p-toggle-3",
    "p-toggle-4",
    "p-toggle-5",
    "p-toggle-6",
    "p-toggle-7",
  ],
  "toggle-group": Array.from({ length: 9 }, (_, index) => `p-toggle-group-${index + 1}`),
} as const;

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

describe("D5 control documentation inventory", () => {
  test("compiles every owned Svelte particle", () => {
    expect(Object.keys(compiledParticles)).toHaveLength(105);
  });

  test("keeps the locked 105-particle ownership set exact", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const actual = ownership.ownership
      .filter(({ implementationLane }) => implementationLane === "D5")
      .map(({ particle }) => particle)
      .sort();

    expect(actual).toEqual([...expectedParticles].sort());
  });

  test.each(expectedParticles)("ports %s with exact metadata and modern Svelte source", (id) => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const record = ownership.ownership.find(({ particle }) => particle === id);
    expect(record).toBeDefined();
    expect(existsSync(resolve(repositoryRoot, record?.targetPath ?? "missing"))).toBe(true);

    const particle = source(record?.targetPath ?? "missing");
    expect(particle).toContain(`id: "${id}"`);
    expect(particle).toMatch(/defineParticleMeta\(\{/);
    const components = /components:\s*(\[[^\]]*\])/s.exec(particle)?.[1];
    expect(JSON.parse((components ?? "[]").replace(/,\s*]$/, "]"))).toEqual(
      record?.componentImports,
    );
    expect(particle).not.toMatch(
      /\b(?:useEffect|useId|useRef|useState|className|onClick)\b|from\s+["']react(?:\/[^"']*)?["']/,
    );
    expect(particle).not.toMatch(/\b(?:export let|createEventDispatcher)\b|\bon:/);
    expect(particle).not.toMatch(/lucide|<svg\b/i);
  });

  test.each(Object.keys(expectedPagePreviews))(
    "ports the exact upstream %s page and preview order",
    (slug) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      const route = `apps/ui/src/routes/docs/components/${slug}/+page.svelte`;
      expect(existsSync(resolve(repositoryRoot, route))).toBe(true);
      expect(page).toContain("<InstallCommand");
      expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
      expect(page).not.toMatch(/\b(?:npm|npx|bun|bunx|yarn)\b/);
      expect(page).not.toMatch(/```(?:tsx|jsx)|@base-ui\/react|lucide-react|from ["']react/);

      const previews = [...page.matchAll(/<ComponentPreview\s+name="([^"]+)"/g)].map(
        ([, id]) => id,
      );
      expect(previews).toEqual(expectedPagePreviews[slug as keyof typeof expectedPagePreviews]);
    },
  );

  test("documents actual Svelte namespaces, bindings, and Shards API links", () => {
    expect(source("apps/ui/content/docs/components/toggle-group.svx")).toContain(
      "<ToggleGroup.Root",
    );
    expect(source("apps/ui/content/docs/components/radio-group.svx")).toContain("<RadioGroup.Root");
    expect(source("apps/ui/content/docs/components/slider.svx")).toContain("<Slider.Root");
    for (const slug of Object.keys(expectedPagePreviews)) {
      const shardsSlug = slug === "radio-group" ? "radio" : slug;
      expect(source(`apps/ui/content/docs/components/${slug}.svx`)).toContain(
        `https://shardsui.com/svelte/${shardsSlug}`,
      );
    }
  });
});
