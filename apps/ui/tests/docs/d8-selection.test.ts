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

  test("locks the rejected particle copy and deterministic async error contract", () => {
    const asyncAutocomplete = source("apps/ui/registry/default/particles/p-autocomplete-12.svelte");
    expect(asyncAutocomplete).toContain('value === "will_error"');
    expect(asyncAutocomplete).toContain('throw new Error("Network error")');
    expect(asyncAutocomplete).toContain("Failed to fetch movies. Please try again.");

    expect(source("apps/ui/registry/default/particles/p-combobox-2.svelte")).toContain(
      'placeholder="Select an item…"',
    );
    expect(source("apps/ui/registry/default/particles/p-combobox-13.svelte")).toContain(
      'aria-label="Search items" placeholder="Search items…"',
    );
    const pillCombobox = source("apps/ui/registry/default/particles/p-combobox-15.svelte");
    expect(pillCombobox).toContain('aria-label="Select a item"');
    expect(pillCombobox).toContain('placeholder="Select a item..."');
  });

  test("server-renders one hydration-stable ID for the labelled combobox control", () => {
    const particle = source("apps/ui/registry/default/particles/p-combobox-5.svelte");
    expect(particle).toContain("<Label for={id}>Fruits</Label>");
    expect(particle).toMatch(/<Combobox\.Input[\s\S]*?(?:id=\{id\}|\{id\})/);
    const module = particleModules["../../registry/default/particles/p-combobox-5.svelte"];
    const body = render(module?.default as Component).body;
    const labelFor = body.match(/<label[^>]*for="([^"]+)"/)?.[1];
    const inputId = body.match(/<input[^>]*id="([^"]+)"/)?.[1];
    expect(labelFor).toBeTruthy();
    expect(inputId).toBe(labelFor);
  });

  test("keeps Command AI parity state, scrolling, focus hooks, and response footer", () => {
    const particle = source("apps/ui/registry/default/particles/p-command-2.svelte");
    expect(particle).toContain("<ScrollArea");
    expect(particle).toContain('role="alert"');
    expect(particle).toContain("Failed to generate response. Please try again.");
    expect(particle).toContain("capture");
    expect(particle).toContain("searchInput?.focus()");
    expect(particle).toContain("aiInput?.focus()");
    expect(particle).toContain("{@attach captureSearchInput}");
    expect(particle).toContain("{@attach captureAIInput}");
    expect(particle).toContain("CircleQuestionMarkIcon");
    expect(particle).toContain("You asked:");
    expect(particle).toContain("HugeiconsIcon,");
    expect(particle).not.toContain('from "@hugeicons/svelte"');

    const toolbar = source("apps/ui/registry/default/particles/p-toolbar-1.svelte");
    expect(toolbar).toContain("HugeiconsIcon,");
    expect(toolbar).not.toContain('from "@hugeicons/svelte"');
  });

  test("server-renders D8 UI icons through the shared Hugeicons renderer", () => {
    const iconParticles = [
      "p-autocomplete-14",
      "p-autocomplete-16",
      "p-combobox-10",
      "p-combobox-13",
      "p-combobox-14",
      "p-combobox-17",
      "p-combobox-18",
      "p-combobox-19",
      "p-combobox-20",
      "p-command-1",
      "p-context-menu-6",
      "p-menu-1",
      "p-select-8",
      "p-select-9",
    ] as const;

    for (const id of iconParticles) {
      const path = `apps/ui/registry/default/particles/${id}.svelte`;
      const particle = source(path);
      expect(particle, path).toMatch(
        /import\s+\{[\s\S]*HugeiconsIcon[\s\S]*\}\s+from\s+"@coss-sv\/ui"/,
      );
      expect(particle, path).not.toMatch(
        /@hugeicons\/svelte|lucide(?:-react|-svelte)?|<svg\b|<path\b/i,
      );
      expect(particle, path).toContain("strokeWidth={2}");
    }

    const serverVisibleIconParticles = iconParticles.filter(
      (id) =>
        !["p-combobox-17", "p-combobox-18", "p-command-1", "p-context-menu-6", "p-menu-1"].includes(
          id,
        ),
    );
    for (const id of serverVisibleIconParticles) {
      const module = particleModules[`../../registry/default/particles/${id}.svelte`];
      const body = render(module?.default as Component).body;
      expect(body, `${id} SSR icon markup`).toContain("<svg");
      expect(body, `${id} SSR stroke width`).toContain('stroke-width="2"');
    }
  });

  test("uses official Hugeicons text-alignment data in the toolbar", () => {
    const toolbar = source("apps/ui/registry/default/particles/p-toolbar-1.svelte");
    expect(toolbar).toContain("TextAlignLeftIcon");
    expect(toolbar).toContain("TextAlignCenterIcon");
    expect(toolbar).toContain("TextAlignRightIcon");
    expect(toolbar).not.toMatch(/AlignHorizontalCenterIcon|\bAlignLeftIcon\b|\bAlignRightIcon\b/);
    expect(toolbar).not.toMatch(/@hugeicons\/svelte|lucide(?:-react|-svelte)?|<svg\b|<path\b/i);

    const module = particleModules["../../registry/default/particles/p-toolbar-1.svelte"];
    const body = render(module?.default as Component).body;
    expect(body.match(/<svg/g)).toHaveLength(6);
    expect(body.match(/stroke-width="2"/g)?.length).toBeGreaterThanOrEqual(5);
  });

  test("uses Svelte 5 declaration tags in the multiple Select particle", () => {
    const particle = source("apps/ui/registry/default/particles/p-select-7.svelte");
    expect(particle).not.toContain("{@const");
    expect(particle).toContain("{const selectedValues");
    expect(particle).toContain("{const firstSelected");
  });

  test("composes toolbar tooltips onto the registered controls without wrapper targets", () => {
    const toolbar = source("apps/ui/registry/default/particles/p-toolbar-1.svelte");
    expect(toolbar).not.toContain("<Tooltip.Trigger");
    expect(toolbar).toContain("{@attach Tooltip.createTriggerAttachment(leftTooltip");
    expect(toolbar).toContain("{@attach Tooltip.createTriggerAttachment(currencyTooltip");
    expect(toolbar).toContain("{@attach Tooltip.createTriggerAttachment(fontTooltip");
    expect(toolbar).toContain('aria-label="Toggle center"');
    expect(toolbar).toContain('aria-label="Toggle right"');
    expect(toolbar).toContain("aria-label={fontLabel}");
  });

  test("ports the complete command reference instead of API stubs", () => {
    const page = source("apps/ui/content/docs/components/command.svx");
    expect(page).toContain("A command palette component built with Dialog and Autocomplete");
    expect(page).toContain("| `items`");
    expect(page).toContain("| `portalProps`");
    expect(page).toContain("| `children`");
    expect(page).toContain('document.addEventListener("keydown", down)');
    expect(page).toContain("const groupedItems = [");
    expect(page).toContain("Standalone Command (Without Dialog)");
    expect([...page.matchAll(/```svelte/g)]).toHaveLength(5);
  });

  test("keeps the complete distinct single and multiple Combobox usage examples", () => {
    const page = source("apps/ui/content/docs/components/combobox.svx");
    expect(page).toContain("### Single Selection");
    expect(page).toContain("### Multiple Selection");
    expect(page).toContain('<Combobox.Input placeholder="Select an item..." />');
    expect(page).toContain("<Combobox.Chips>");
    expect(page).toContain("<Combobox.Value>");
    expect(page).toContain("<Combobox.Chip aria-label={item.value} value={item.value}>");
    expect(page).toContain('placeholder={value.length > 0 ? undefined : "Select an item..."}');
    expect([...page.matchAll(/```svelte/g)]).toHaveLength(4);
  });

  test("documents Toggle-composed toolbar controls instead of plain buttons", () => {
    const page = source("apps/ui/content/docs/components/toolbar.svx");
    expect(page).toContain(
      'import * as ToggleGroup from "@coss-sv/ui/components/ui/toggle-group";',
    );
    expect(page).toContain('<ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>');
    expect(page).toContain('<ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>');
    expect(page).not.toContain("<Toolbar.Button>Bold</Toolbar.Button>");
    expect(page).not.toContain("<Toolbar.Button>Underline</Toolbar.Button>");
  });

  test("uses only exported wrapper types in D8 API tables", () => {
    const pages = Object.keys(expectedPreviews).map((slug) =>
      source(`apps/ui/content/docs/components/${slug}.svx`),
    );
    const inventedTypes = [
      "AutocompletePortalProps",
      "ComboboxPortalProps",
      "SelectPortalProps",
      "MenuPortalProps",
      "ContextMenuPortalProps",
      "AutocompleteRootProps",
      "DialogRootState",
      "DialogPortalProps",
    ];
    for (const invented of inventedTypes) {
      expect(pages.join("\n"), invented).not.toContain(`\`${invented}\``);
    }
    expect(pages.join("\n")).not.toContain("`Dialog.PortalProps`");

    expect(pages[0]).toContain('`AutocompletePopupProps["portalProps"]`');
    expect(pages[1]).toContain('`ComboboxPopupProps["portalProps"]`');
    expect(pages[2]).toContain('`SelectPopupProps["portalProps"]`');
    expect(pages[4]).toContain('`MenuPopupProps["portalProps"]`');
    expect(pages[5]).toContain('`ContextMenuPopupProps["portalProps"]`');

    const provenTypes = {
      AutocompletePopupProps:
        "packages/ui/src/components/ui/autocomplete/autocomplete-popup.svelte",
      ComboboxPopupProps: "packages/ui/src/components/ui/combobox/combobox-popup.svelte",
      CommandDialogPopupProps: "packages/ui/src/components/ui/command/command-dialog-popup.svelte",
      CommandDialogTriggerProps:
        "packages/ui/src/components/ui/command/command-dialog-trigger.svelte",
      CommandFooterProps: "packages/ui/src/components/ui/command/command-footer.svelte",
      CommandPanelProps: "packages/ui/src/components/ui/command/command-panel.svelte",
      CommandShortcutProps: "packages/ui/src/components/ui/command/command-shortcut.svelte",
      ContextMenuPopupProps: "packages/ui/src/components/ui/context-menu/context-menu.types.ts",
      MenuPopupProps: "packages/ui/src/components/ui/menu/menu.types.ts",
      SelectPopupProps: "packages/ui/src/components/ui/select/select-popup.svelte",
    } as const;
    for (const [typeName, path] of Object.entries(provenTypes)) {
      expect(source(path), typeName).toContain(`export type ${typeName}`);
    }
    expect(source("packages/ui/src/components/ui/command/index.ts")).toContain(
      "export const DialogRoot: typeof D.Root = D.Root;",
    );
    expect(pages[3]).toContain("`Snippet<[{ payload: Payload \\| undefined }]>`");
  });

  test("does not omit upstream API tables or Select labelling guidance", () => {
    const minimumTableCounts = {
      autocomplete: 9,
      combobox: 12,
      command: 15,
      "context-menu": 7,
      menu: 7,
      select: 3,
      toolbar: 0,
    } as const;
    for (const [slug, minimum] of Object.entries(minimumTableCounts)) {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect((page.match(/^\| Prop/gm) ?? []).length, slug).toBeGreaterThanOrEqual(minimum);
    }
    expect(source("apps/ui/content/docs/components/select.svx")).toContain(
      "For accessible labelling and validation, prefer using the `Field` component to wrap selects.",
    );
  });
});
