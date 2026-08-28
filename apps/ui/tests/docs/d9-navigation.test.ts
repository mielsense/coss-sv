import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mdsvex } from "mdsvex";
import type { Component } from "svelte";
import { compile, preprocess } from "svelte/compiler";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { highlightSource } from "../../src/lib/code/highlight.js";
import {
  documentationComponents,
  modernizeDocumentationOutput,
} from "../../src/lib/content/preprocess.js";

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");
const particleModules = import.meta.glob<{ default: Component }>(
  "../../registry/default/particles/p-*.svelte",
  { eager: true },
);

type OwnershipFile = {
  ownership: Array<{
    componentImports: string[];
    implementationLane: string;
    particle: string;
    targetPath: string;
  }>;
};

const expectedParticles = [
  ...Array.from({ length: 7 }, (_, index) => `p-breadcrumb-${index + 1}`),
  ...Array.from({ length: 25 }, (_, index) => `p-calendar-${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `p-date-picker-${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `p-pagination-${index + 1}`),
  ...Array.from({ length: 5 }, (_, index) => `p-scroll-area-${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `p-navigation-${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `p-radio-group-${index + 7}`),
  "p-tabs-1",
  ...Array.from({ length: 8 }, (_, index) => `p-table-${index + 1}`),
] as const;

const expectedPagePreviews = {
  breadcrumb: ["p-breadcrumb-1", "p-breadcrumb-2"],
  calendar: [
    "p-calendar-1",
    "p-calendar-2",
    "p-calendar-3",
    "p-calendar-4",
    "p-calendar-5",
    "p-calendar-6",
  ],
  "date-picker": [
    "p-date-picker-1",
    "p-date-picker-2",
    "p-date-picker-3",
    "p-date-picker-4",
    "p-date-picker-5",
    "p-date-picker-6",
  ],
  pagination: ["p-pagination-1"],
  "scroll-area": [
    "p-scroll-area-1",
    "p-scroll-area-4",
    "p-scroll-area-2",
    "p-scroll-area-5",
    "p-scroll-area-3",
  ],
  "segmented-control": [
    "p-radio-group-8",
    "p-radio-group-7",
    "p-radio-group-8",
    "p-radio-group-9",
    "p-navigation-2",
    "p-navigation-1",
    "p-navigation-3",
    "p-tabs-1",
  ],
  table: ["p-table-1", "p-table-5", "p-table-7", "p-table-2", "p-table-6"],
} as const;

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

describe("D9 date, navigation, and table documentation", () => {
  test("keeps the exact 64-particle ownership inventory", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    expect(
      ownership.ownership
        .filter(({ implementationLane }) => implementationLane === "D9")
        .map(({ particle }) => particle)
        .sort(),
    ).toEqual([...expectedParticles].sort());
  });

  test.each(expectedParticles)("ports %s with exact metadata and modern Svelte", (id) => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const record = ownership.ownership.find(({ particle }) => particle === id);
    expect(record).toBeDefined();
    expect(existsSync(resolve(repositoryRoot, record?.targetPath ?? "missing"))).toBe(true);
    const particle = source(record?.targetPath ?? "missing");

    expect(particle).toContain(`id: "${id}"`);
    expect(particle).toContain("defineParticleMeta(");
    const declared = /components:\s*(\[[^\]]*\])/s.exec(particle)?.[1];
    expect([...(declared?.matchAll(/"([^"]+)"/g) ?? [])].map(([, component]) => component)).toEqual(
      record?.componentImports,
    );
    expect(particle).not.toMatch(
      /\b(?:export let|createEventDispatcher|onClick|useState|useEffect)\b|\bclassName=|\bon:/,
    );
    expect(particle).not.toMatch(
      /(?:lucide(?:-react|-svelte)?|<svg\b|@base-ui\/react|from\s+["']react)/i,
    );
  });

  test.each(expectedParticles)("server-renders %s", (id) => {
    const module = particleModules[`../../registry/default/particles/${id}.svelte`];
    expect(module).toBeDefined();
    expect(() => render(module?.default as Component)).not.toThrow();
  });

  test.each(Array.from({ length: 7 }, (_, index) => `p-breadcrumb-${index + 1}`))(
    "imports every rendered Breadcrumb component in %s",
    (id) => {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      const packageImport = /import\s*\{([\s\S]*?)\}\s*from "@coss-sv\/ui";/.exec(particle)?.[1];
      expect(packageImport).toBeDefined();
      for (const [, component] of particle.matchAll(
        /<(Breadcrumb(?:List|Item|Link|Page|Separator|Ellipsis)?)\b/g,
      )) {
        expect(packageImport).toMatch(new RegExp(`\\b${component}\\b`));
      }
    },
  );

  test.each(Object.entries(expectedPagePreviews))(
    "ports the exact upstream %s page and preview order",
    (slug, expected) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect(page).toContain("<InstallCommand");
      expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
      expect(page).not.toMatch(
        /\b(?:npm|npx|bun|bunx|yarn)\b|```(?:jsx|tsx)|@base-ui\/react|lucide|from ["']react/i,
      );
      expect([...page.matchAll(/<ComponentPreview\s+name="([^"]+)"/g)].map(([, id]) => id)).toEqual(
        expected,
      );
    },
  );

  test.each(Object.keys(expectedPagePreviews))("compiles the %s page as MDsveX", async (slug) => {
    const filename = resolve(appRoot, `content/docs/components/${slug}.svx`);
    const result = await preprocess(
      source(`apps/ui/content/docs/components/${slug}.svx`),
      [
        documentationComponents({
          loadParticleSource: async () => highlightSource("<button>Preview</button>", "svelte"),
        }),
        mdsvex({ extensions: [".svx"] }),
        modernizeDocumentationOutput(),
      ],
      { filename },
    );
    expect(() => compile(result.code, { filename, runes: true })).not.toThrow();
  });

  test("uses the shared segmented-control helper without duplicating its classes", () => {
    for (const id of [
      "p-navigation-1",
      "p-navigation-2",
      "p-navigation-3",
      "p-radio-group-7",
      "p-radio-group-8",
      "p-radio-group-9",
    ]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      expect(particle).toContain('from "@coss-sv/ui/lib/segmented-control"');
      expect(particle).not.toContain("relative z-0 flex w-fit items-center");
    }
  });

  test("freezes date examples and preserves high-risk contracts", () => {
    for (const id of expectedParticles.filter(
      (id) => id.startsWith("p-calendar-") || id.startsWith("p-date-picker-"),
    )) {
      expect(source(`apps/ui/registry/default/particles/${id}.svelte`)).toContain("2026");
    }
    expect(source("apps/ui/registry/default/particles/p-calendar-22.svelte")).toContain(
      "numberOfMonths={2}",
    );
    expect(source("apps/ui/registry/default/particles/p-calendar-23.svelte")).toContain(
      "numberOfMonths={3}",
    );
    expect(source("apps/ui/registry/default/particles/p-date-picker-6.svelte")).toContain(
      "popoverOpen = false",
    );
    expect(source("apps/ui/registry/default/particles/p-pagination-1.svelte")).toContain(
      'aria-current="page"',
    );
    expect(source("apps/ui/registry/default/particles/p-tabs-1.svelte")).toMatch(
      /<Tabs\.Root\s+defaultValue="tab-1"/,
    );
  });

  test("preserves exact date-fns display semantics and the complete editable-time algorithm", async () => {
    const appointment = render(
      particleModules["../../registry/default/particles/p-calendar-19.svelte"]
        ?.default as Component,
    ).body;
    expect(appointment).toContain("Friday, 28");

    const calendarModule = await import("../../registry/default/particles/p-calendar-25.svelte");
    expect(calendarModule.formatTimeInput("615")).toBe("6:15");
    expect(calendarModule.parseTime("615")).toBe("06:15");
    expect(calendarModule.filterTime("06:15", "61")).toBe(true);
    expect(calendarModule.filterTime("16:15", "61")).toBe(false);

    for (const id of [
      "p-date-picker-1",
      "p-date-picker-3",
      "p-date-picker-4",
      "p-date-picker-6",
      "p-date-picker-8",
    ]) {
      expect(source(`apps/ui/registry/default/particles/${id}.svelte`)).toContain("formatDatePpp(");
    }
  });

  test("composes the select-style picker as one valid Popover trigger", () => {
    const particle = source("apps/ui/registry/default/particles/p-date-picker-8.svelte");
    expect(particle).toMatch(/<Popover\.Trigger\s+as="button"/);
    expect(particle).not.toContain('<Popover.Trigger as="div"');
    expect(particle).not.toContain("<Select.Button");
  });

  test("ports the complete upstream Table and Scroll Area documentation", () => {
    const table = source("apps/ui/content/docs/components/table.svx");
    for (const exactText of [
      "That pairs well with a [Frame](/docs/components/frame)",
      "### Table.Header",
      "### Table.Body",
      "### Table.Footer",
      "### Table.Row",
      "### Table.Head",
      "### Table.Cell",
      "### Table.Caption",
      "The example below is static markup—no row selection or TanStack.",
      "## Changelog",
      "Apr 12, 2026",
    ]) {
      expect(table).toContain(exactText);
    }

    const scrollArea = source("apps/ui/content/docs/components/scroll-area.svx");
    for (const exactText of [
      "Just as suddenly as it had begun",
      "### ScrollArea.Viewport",
      "### ScrollArea.Scrollbar",
      "### ScrollArea.Thumb",
      "### ScrollArea.Corner",
      "Leave `fill` at the default (`false`)",
      "### Content min-width",
      "July 31, 2026",
      "May 29, 2026",
    ]) {
      expect(scrollArea).toContain(exactText);
    }
  });

  test("preserves wide preview geometry", () => {
    for (const id of [
      "p-calendar-22",
      "p-calendar-23",
      "p-calendar-24",
      ...Array.from({ length: 8 }, (_, index) => `p-table-${index + 1}`),
    ]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      expect(particle).toContain("colSpan: 2");
    }
  });
});
