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
  "p-alert-dialog-1",
  "p-alert-dialog-2",
  "p-dialog-1",
  "p-dialog-2",
  "p-dialog-3",
  "p-dialog-4",
  "p-dialog-5",
  "p-dialog-6",
  "p-drawer-1",
  "p-drawer-10",
  "p-drawer-11",
  "p-drawer-12",
  "p-drawer-13",
  "p-drawer-14",
  "p-drawer-2",
  "p-drawer-3",
  "p-drawer-4",
  "p-drawer-5",
  "p-drawer-6",
  "p-drawer-7",
  "p-drawer-8",
  "p-drawer-9",
  "p-popover-1",
  "p-popover-2",
  "p-popover-3",
  "p-popover-4",
  "p-preview-card-1",
  "p-sheet-1",
  "p-sheet-2",
  "p-sheet-3",
  "p-tooltip-1",
  "p-tooltip-2",
  "p-tooltip-3",
  "p-tooltip-4",
] as const;

const pages = [
  "dialog",
  "alert-dialog",
  "sheet",
  "drawer",
  "popover",
  "preview-card",
  "tooltip",
] as const;

const previews: Record<(typeof pages)[number], readonly string[]> = {
  dialog: ["p-dialog-1", "p-dialog-2", "p-dialog-6", "p-dialog-5", "p-dialog-3", "p-dialog-4"],
  "alert-dialog": ["p-alert-dialog-1", "p-alert-dialog-2", "p-dialog-4"],
  sheet: ["p-sheet-1", "p-sheet-2", "p-sheet-3"],
  drawer: [
    "p-drawer-1",
    "p-drawer-4",
    "p-drawer-5",
    "p-drawer-6",
    "p-drawer-7",
    "p-drawer-9",
    "p-drawer-11",
    "p-drawer-12",
    "p-drawer-13",
  ],
  popover: ["p-popover-1", "p-popover-2", "p-input-group-7", "p-popover-3"],
  "preview-card": ["p-preview-card-1"],
  tooltip: ["p-tooltip-1", "p-tooltip-2", "p-tooltip-3"],
};

const shardsLinks: Record<(typeof pages)[number], string> = {
  dialog: "dialog",
  "alert-dialog": "alert-dialog",
  sheet: "dialog",
  drawer: "drawer",
  popover: "popover",
  "preview-card": "preview-card",
  tooltip: "tooltip",
};

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

describe("D7 overlay documentation", () => {
  test("keeps the exact 34-particle ownership inventory", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    expect(
      ownership.ownership
        .filter(({ implementationLane }) => implementationLane === "D7")
        .map(({ particle }) => particle)
        .sort(),
    ).toEqual([...expectedParticles].sort());
  });

  test.each(expectedParticles)("ports %s with exact ownership metadata and modern Svelte", (id) => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const record = ownership.ownership.find(({ particle }) => particle === id);
    expect(record).toBeDefined();
    expect(existsSync(resolve(repositoryRoot, record?.targetPath ?? "missing"))).toBe(true);
    const particle = source(record?.targetPath ?? "missing");

    expect(particle).toContain(`id: "${id}"`);
    expect(particle).toContain("defineParticleMeta({");
    const declared = /components:\s*(\[[^\]]*\])/s.exec(particle)?.[1];
    expect(JSON.parse(declared ?? "[]")).toEqual(record?.componentImports);
    expect(particle).not.toMatch(
      /\b(?:export let|createEventDispatcher|className|onClick|useState|useEffect)\b|\bon:/,
    );
    expect(particle).not.toMatch(
      /(?:lucide(?:-react|-svelte)?|<svg\b|@base-ui\/react|from\s+["']react)/i,
    );
  });

  test.each(expectedParticles)(
    "server-renders %s without browser globals or missing exports",
    (id) => {
      const module = particleModules[`../../registry/default/particles/${id}.svelte`];
      expect(module).toBeDefined();
      expect(() => render(module?.default as Component)).not.toThrow();
    },
  );

  test.each(pages)("ports the complete %s page and exact preview order", (slug) => {
    const page = source(`apps/ui/content/docs/components/${slug}.svx`);
    expect(page).toContain("<InstallCommand");
    expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
    expect(page).toContain(`https://shardsui.com/svelte/${shardsLinks[slug]}`);
    expect(page).not.toMatch(
      /\b(?:npm|npx|bun|bunx|yarn)\b|```(?:jsx|tsx)|@base-ui\/react|lucide|from ["']react/i,
    );
    expect([...page.matchAll(/<ComponentPreview\s+name="([^"]+)"/g)].map(([, id]) => id)).toEqual(
      previews[slug],
    );
  });

  test.each(pages)("compiles the %s page as modern MDsveX", async (slug) => {
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

  test("uses public namespace APIs in displayed Svelte", () => {
    for (const namespace of [
      "Dialog",
      "AlertDialog",
      "Sheet",
      "Drawer",
      "Popover",
      "PreviewCard",
      "Tooltip",
    ]) {
      const slug = namespace.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      expect(source(`apps/ui/content/docs/components/${slug}.svx`)).toContain(`<${namespace}.Root`);
    }
  });

  test("preserves high-risk interaction data and Hugeicons", () => {
    expect(source("apps/ui/registry/default/particles/p-drawer-6.svelte")).toContain(
      "Array.from({ length: 48 }",
    );
    expect(source("apps/ui/registry/default/particles/p-drawer-9.svelte")).toContain(
      'snapPoints={["300px", 1]}',
    );
    expect(source("apps/ui/registry/default/particles/p-popover-4.svelte")).toContain(
      'time: "9:00 – 9:30am"',
    );
    expect(source("apps/ui/registry/default/particles/p-preview-card-1.svelte")).toContain("58.2k");
    for (const id of [
      "p-drawer-13",
      "p-popover-2",
      "p-popover-3",
      "p-preview-card-1",
      "p-tooltip-2",
      "p-tooltip-3",
      "p-tooltip-4",
    ]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      expect(particle).toContain('from "@hugeicons/core-free-icons"');
      expect(particle).toContain('from "@hugeicons/svelte"');
      expect(particle).toContain("strokeWidth={2}");
    }
  });
});
