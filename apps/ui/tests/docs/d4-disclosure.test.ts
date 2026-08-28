import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import EmptyDocumentation from "../../content/docs/components/empty.svx";

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

const expectedPagePackages: Record<(typeof pages)[number], readonly string[]> = {
  accordion: ["@coss-sv/ui"],
  card: ["@coss-sv/ui", "@hugeicons/svelte", "@hugeicons/core-free-icons"],
  collapsible: ["@coss-sv/ui"],
  empty: ["@coss-sv/ui", "@hugeicons/svelte", "@hugeicons/core-free-icons"],
  frame: ["@coss-sv/ui"],
  separator: ["@coss-sv/ui"],
  skeleton: ["@coss-sv/ui"],
  tabs: ["@coss-sv/ui"],
};

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

function displayedSvelteImports(page: string): string[] {
  const codeBlocks = [...page.matchAll(/```svelte\s*\n([\s\S]*?)```/g)].map(
    ([, code]) => code ?? "",
  );
  return codeBlocks.flatMap((code) => [
    ...[...code.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map(([, specifier]) => specifier ?? ""),
    ...[...code.matchAll(/\bimport\s+["']([^"']+)["']/g)].map(([, specifier]) => specifier ?? ""),
  ]);
}

function barePackageName(specifier: string): string | undefined {
  if (!specifier || /^(?:\.|\/|\$|#|node:)/.test(specifier)) return undefined;
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

function fencedSvelteBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/```svelte\s*\n([\s\S]*?)```/g)].map(([, code]) => code ?? "");
}

function levelThreeSections(markdown: string): Array<{ body: string; heading: string }> {
  const headings = [...markdown.matchAll(/^### (.+)$/gm)];
  return headings.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    return { body: markdown.slice(start, end), heading: match[1] ?? "" };
  });
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

  test("keeps all seven upstream Empty API examples in their exact section order", () => {
    const page = source("apps/ui/content/docs/components/empty.svx");
    const [usage] = fencedSvelteBlocks(page);
    const apiReference = page.slice(page.indexOf("## API Reference"));
    const sections = levelThreeSections(apiReference);

    expect(sections.map(({ heading }) => heading)).toEqual([
      "Empty",
      "EmptyHeader",
      "EmptyMedia",
      "EmptyTitle",
      "EmptyDescription",
      "EmptyContent",
    ]);
    expect(sections.map(({ body }) => fencedSvelteBlocks(body).length)).toEqual([1, 1, 2, 1, 1, 1]);

    const examples = sections.flatMap(({ body }) => fencedSvelteBlocks(body));
    expect(examples).toHaveLength(7);
    expect(examples[0]).toContain("<Empty>");
    expect(examples[0]).toContain("<EmptyHeader />");
    expect(examples[0]).toContain("<EmptyContent />");
    expect(examples[1]).toContain("<EmptyHeader>");
    expect(examples[1]).toContain("<EmptyMedia />");
    expect(examples[2]).toContain('<EmptyMedia variant="icon">');
    expect(examples[2]).toContain("<HugeiconsIcon");
    expect(examples[3]).toContain("<Avatar.Root>");
    expect(examples[3]).toContain('<Avatar.Image src="..." />');
    expect(examples[3]).toContain("<Avatar.Fallback>JD</Avatar.Fallback>");
    expect(examples[4]).toContain("<EmptyTitle>No data</EmptyTitle>");
    expect(examples[5]).toContain(
      "<EmptyDescription>You do not have any notifications.</EmptyDescription>",
    );
    expect(examples[6]).toContain("<EmptyContent>");
    expect(examples[6]).toContain("<Button>Add Project</Button>");
    expect(examples.filter((example) => example.includes("<HugeiconsIcon"))).toEqual([examples[2]]);
    expect(usage).toContain("Avatar,");
    expect(page).toContain('from "@coss-sv/ui"');
  });

  test("compiles every displayed Empty Svelte source block", () => {
    const page = source("apps/ui/content/docs/components/empty.svx");
    const examples = fencedSvelteBlocks(page);

    expect(examples).toHaveLength(8);
    examples.forEach((example, index) => {
      expect(() =>
        compile(example, {
          filename: `empty-displayed-example-${index + 1}.svelte`,
          generate: "server",
          runes: true,
        }),
      ).not.toThrow();
    });
  });

  test("server-renders all Empty API sections and displayed examples", () => {
    const body = render(EmptyDocumentation).body;
    const apiReference = body.slice(body.indexOf('<h2 id="api-reference">'));

    for (const id of [
      "empty",
      "emptyheader",
      "emptymedia",
      "emptytitle",
      "emptydescription",
      "emptycontent",
    ]) {
      expect(apiReference).toContain(`<h3 id="${id}">`);
    }
    expect(apiReference.match(/<pre class="shiki shiki-themes/g)).toHaveLength(7);
    for (const component of [
      "Empty",
      "EmptyHeader",
      "EmptyMedia",
      "Avatar",
      "EmptyTitle",
      "EmptyDescription",
      "EmptyContent",
      "Button",
    ]) {
      expect(apiReference).toContain(`>${component}</span>`);
    }
    expect(apiReference).toContain("You do not have any notifications.");
    expect(apiReference).toContain("Add Project");
  });

  test("uses Svelte and ShardsUI copy in every accordion particle", () => {
    for (const id of ["p-accordion-1", "p-accordion-2", "p-accordion-3", "p-accordion-4"]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      const visibleCopy = particle.replace(/\s+/g, " ");

      expect(visibleCopy).toContain("What is ShardsUI?");
      expect(visibleCopy).toContain(
        "ShardsUI is a library of headless, accessible Svelte 5 components for design systems and web apps.",
      );
      expect(visibleCopy).toContain("Of course! ShardsUI is free and open source.");
      expect(visibleCopy).not.toMatch(/Base UI|React components/);
    }
  });

  test.each(pages)(
    "installs the package that provides the imports shown on the %s page",
    (slug) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      const install = /<InstallCommand\s+pnpm="([^"]+)"\s+shadcnSvelte="([^"]+)"\s*\/>/.exec(page);
      const displayedImports = displayedSvelteImports(page);
      const displayedPackages = [
        ...new Set(displayedImports.map(barePackageName).filter((value) => value !== undefined)),
      ];
      const installedPackages = install?.[1]?.split(/\s+/).slice(2);

      expect(installedPackages).toEqual(expectedPagePackages[slug]);
      expect(install?.[2]).toBe(
        `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/${slug}.json`,
      );
      expect(displayedImports.length).toBeGreaterThan(0);
      expect(displayedPackages.toSorted()).toEqual(expectedPagePackages[slug].toSorted());
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
