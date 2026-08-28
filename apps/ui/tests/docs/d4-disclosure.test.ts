import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");

type OwnershipFile = {
  ownership: Array<{
    componentImports: string[];
    implementationLane: string;
    particle: string;
    primaryPage: string;
    targetPath: string;
  }>;
};

const expectedParticles = [
  "p-accordion-1",
  "p-accordion-2",
  "p-accordion-3",
  "p-accordion-4",
  "p-card-1",
  "p-card-10",
  "p-card-11",
  "p-card-2",
  "p-card-3",
  "p-card-4",
  "p-card-5",
  "p-card-6",
  "p-card-7",
  "p-card-8",
  "p-card-9",
  "p-collapsible-1",
  "p-empty-1",
  "p-frame-1",
  "p-frame-2",
  "p-frame-3",
  "p-frame-4",
  "p-separator-1",
  "p-skeleton-1",
  "p-skeleton-2",
  "p-tabs-10",
  "p-tabs-11",
  "p-tabs-12",
  "p-tabs-13",
  "p-tabs-14",
  "p-tabs-15",
  "p-tabs-2",
  "p-tabs-3",
  "p-tabs-4",
  "p-tabs-5",
  "p-tabs-6",
  "p-tabs-7",
  "p-tabs-8",
  "p-tabs-9",
] as const;

const pages = [
  "accordion",
  "collapsible",
  "tabs",
  "separator",
  "frame",
  "card",
  "empty",
  "skeleton",
] as const;

const iconParticles = new Set([
  "p-card-1",
  "p-card-10",
  "p-card-11",
  "p-card-3",
  "p-card-4",
  "p-card-6",
  "p-card-7",
  "p-card-8",
  "p-collapsible-1",
  "p-empty-1",
  "p-frame-2",
  "p-skeleton-1",
  "p-tabs-11",
  "p-tabs-12",
  "p-tabs-13",
  "p-tabs-6",
  "p-tabs-7",
  "p-tabs-8",
  "p-tabs-9",
]);

const expectedPagePreviews: Record<(typeof pages)[number], readonly string[]> = {
  accordion: ["p-accordion-1", "p-accordion-2", "p-accordion-3", "p-accordion-4"],
  card: ["p-card-1"],
  collapsible: ["p-collapsible-1"],
  empty: ["p-empty-1"],
  frame: ["p-frame-1", "p-frame-3"],
  separator: ["p-separator-1"],
  skeleton: ["p-skeleton-1", "p-skeleton-2"],
  tabs: ["p-tabs-1", "p-tabs-14", "p-tabs-15", "p-tabs-2", "p-tabs-3", "p-tabs-4"],
};

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

describe("D4 disclosure and surface documentation inventory", () => {
  test("keeps the locked 38-particle ownership set exact", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const actual = ownership.ownership
      .filter(({ implementationLane }) => implementationLane === "D4")
      .map(({ particle }) => particle)
      .sort();

    expect(actual).toEqual([...expectedParticles].sort());
  });

  test.each(expectedParticles)("ports %s as modern Svelte with exact metadata ownership", (id) => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const record = ownership.ownership.find(({ particle }) => particle === id);
    expect(record).toBeDefined();
    expect(existsSync(resolve(repositoryRoot, record?.targetPath ?? "missing"))).toBe(true);

    const particle = source(record?.targetPath ?? "missing");
    expect(particle).toContain(`id: "${id}"`);
    expect(particle).toMatch(/defineParticleMeta\(\{/);
    const declaredComponents = /components:\s*(\[[^\]]*\])/s.exec(particle)?.[1];
    expect(declaredComponents).toBeDefined();
    expect(JSON.parse(declaredComponents ?? "[]")).toEqual(record?.componentImports);
    expect(particle).not.toMatch(
      /\b(?:useEffect|useState|className|onClick)\b|from\s+["']react(?:\/[^"']*)?["']/,
    );
    expect(particle).not.toMatch(/\b(?:export let|createEventDispatcher)\b|\bon:/);
    expect(particle).not.toMatch(/<svg\b|lucide(?:-react|-svelte)?/i);
    if (iconParticles.has(id)) {
      expect(particle).toContain('from "@hugeicons/core-free-icons"');
      expect(particle).toContain('from "@hugeicons/svelte"');
      expect(particle).toContain("<HugeiconsIcon");
    }
  });

  test.each(pages)("ports the exact upstream %s page and preview order", (slug) => {
    const contentPath = `apps/ui/content/docs/components/${slug}.svx`;
    const routePath = `apps/ui/src/routes/docs/components/${slug}/+page.svelte`;
    const page = source(contentPath);
    const previewDependenciesReady = expectedPagePreviews[slug].every((id) =>
      existsSync(resolve(repositoryRoot, `apps/ui/registry/default/particles/${id}.svelte`)),
    );

    expect(existsSync(resolve(repositoryRoot, routePath))).toBe(previewDependenciesReady);
    expect(page).toContain("<InstallCommand");
    expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
    expect(page).not.toMatch(/\b(?:npm|npx|bun|bunx|yarn)\b/);
    expect(page).not.toMatch(/```(?:tsx|jsx)|@base-ui\/react|lucide-react|from "react/);

    const previews = [...page.matchAll(/<ComponentPreview\s+name="([^"]+)"/g)].map(([, id]) => id);
    expect(previews).toEqual(expectedPagePreviews[slug]);
  });

  test("documents namespace APIs and the actual Shards-backed behavior", () => {
    expect(source("apps/ui/content/docs/components/accordion.svx")).toContain("<Accordion.Root>");
    expect(source("apps/ui/content/docs/components/collapsible.svx")).toContain(
      "<Collapsible.Root>",
    );
    expect(source("apps/ui/content/docs/components/tabs.svx")).toContain("<Tabs.Root");
    expect(source("apps/ui/content/docs/components/separator.svx")).toContain(
      "https://shardsui.com/svelte/separator",
    );
  });

  test("uses Svelte and Shards UI copy in every accordion particle", () => {
    for (const id of ["p-accordion-1", "p-accordion-2", "p-accordion-3", "p-accordion-4"]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      const visibleCopy = particle.replace(/\s+/g, " ");

      expect(visibleCopy).toContain("What is Shards UI?");
      expect(visibleCopy).toContain(
        "Shards UI is a library of headless, accessible Svelte 5 components for design systems and web apps.",
      );
      expect(visibleCopy).toContain("Of course! Shards UI is free and open source.");
      expect(visibleCopy).not.toMatch(/Base UI|React components/);
    }
  });

  test.each(pages)(
    "installs the package that provides the imports shown on the %s page",
    (slug) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      const install = /<InstallCommand\s+pnpm="([^"]+)"\s+shadcnSvelte="([^"]+)"\s*\/>/.exec(page);
      const displayedImports = [...page.matchAll(/from\s+"(@coss-sv\/ui[^"]*)"/g)].map(
        ([, specifier]) => specifier,
      );

      expect(install?.[1]).toBe("pnpm add @coss-sv/ui");
      expect(install?.[2]).toBe(
        `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/${slug}.json`,
      );
      expect(displayedImports.length).toBeGreaterThan(0);
      expect(displayedImports.every((specifier) => specifier?.startsWith("@coss-sv/ui"))).toBe(
        true,
      );
    },
  );

  test("keeps the tabs landing route pending on the D9-owned primary preview", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const primaryPreview = ownership.ownership.find(({ particle }) => particle === "p-tabs-1");

    expect(primaryPreview).toMatchObject({
      implementationLane: "D9",
      primaryPage: "components/segmented-control",
    });
    expect(existsSync(resolve(repositoryRoot, primaryPreview?.targetPath ?? "missing"))).toBe(
      false,
    );
    expect(
      existsSync(resolve(repositoryRoot, "apps/ui/src/routes/docs/components/tabs/+page.svelte")),
    ).toBe(false);
  });
});
