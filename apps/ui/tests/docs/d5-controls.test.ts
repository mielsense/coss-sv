import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";
import CheckboxFormExample from "../../registry/default/particles/p-checkbox-5.svelte";
import CheckboxGroupFormExample from "../../registry/default/particles/p-checkbox-group-5.svelte";
import RadioGroupFormExample from "../../registry/default/particles/p-radio-group-5.svelte";
import SliderFieldExample from "../../registry/default/particles/p-slider-2.svelte";
import SliderFormExample from "../../registry/default/particles/p-slider-23.svelte";
import SwitchFormExample from "../../registry/default/particles/p-switch-5.svelte";
import Availability7 from "../../registry/default/particles/p-switch-7.svelte";
import Availability8 from "../../registry/default/particles/p-switch-8.svelte";
import Availability9 from "../../registry/default/particles/p-switch-9.svelte";

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

const expectedPreviewMetadata = {
  "p-radio-group-6": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-[320px]",
  },
  "p-slider-13": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-slider-14": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-slider-15": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-slider-16": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-slider-21": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-slider-22": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-slider-23": {
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
  "p-switch-7": {
    colSpan: 2,
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-4xl",
  },
  "p-switch-8": {
    colSpan: 2,
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-4xl",
  },
  "p-switch-9": {
    colSpan: 2,
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-4xl",
  },
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
    expect(particle).toMatch(/defineParticleMeta\(/);
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

  test.each(Object.entries(expectedPreviewMetadata))(
    "preserves the upstream preview geometry metadata for %s",
    (id, expected) => {
      const modulePath = `../../registry/default/particles/${id}.svelte`;
      const particleModule = compiledParticles[modulePath] as
        | {
            meta: {
              colSpan?: number;
              containerClass?: string;
            };
          }
        | undefined;

      expect(particleModule?.meta.containerClass).toBe(expected.containerClass);
      if ("colSpan" in expected) {
        expect(particleModule?.meta.colSpan).toBe(expected.colSpan);
      }
    },
  );

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

  test("keeps every weekly availability editor complete and searchable", () => {
    for (const id of ["p-switch-7", "p-switch-8", "p-switch-9"]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);

      expect(particle).toContain("Array.from({ length: 96 }");
      expect(particle).toContain('placeholder="Search time"');
      expect(particle).toContain("<Combobox.Empty>No times found.</Combobox.Empty>");
      expect(particle).toContain("<Combobox.Collection>");
      expect(particle).toContain("timeOptions.slice(timeIndex(range.start) + 1)");
      expect(particle).toContain("Math.min(timeIndex(lastRange.end) + 4, timeOptions.length - 2)");
      expect(particle).toContain("Math.min(startIndex + 4, timeOptions.length - 1)");
      expect(particle).toContain("Math.min(timeIndex(start) + 4, timeOptions.length - 1)");
      expect(particle).toContain("Copy times to");
      expect(particle).toContain("<CheckboxGroup.Item");
      expect(particle).not.toMatch(/<select\b|<Checkbox(?:\s|>)/);
    }

    const selectButton = source("apps/ui/registry/default/particles/p-switch-7.svelte");
    expect(selectButton).toContain(
      '"min-h-8 min-w-0 gap-1.5 px-[calc(--spacing(2.5)-1px)] tabular-nums sm:min-h-7 w-27"',
    );
  });

  test("renders the scheduling editors without build-shell diagnostics", () => {
    for (const Example of [Availability7, Availability8, Availability9]) {
      const { body } = renderServer(Example);

      expect(body).toContain("Monday");
      expect(body).not.toContain("parse error near");
      expect(body).not.toContain("(eval):5");
      if (Example === Availability7) {
        expect(body).toContain("min-h-8 min-w-0 gap-1.5");
        expect(body).toContain("sm:min-h-7 w-27");
      }
    }
  });

  test("renders package Form, Field, and Fieldset composition in the six form particles", () => {
    const rendered = [
      renderServer(CheckboxFormExample).body,
      renderServer(CheckboxGroupFormExample).body,
      renderServer(RadioGroupFormExample).body,
      renderServer(SliderFieldExample).body,
      renderServer(SliderFormExample).body,
      renderServer(SwitchFormExample).body,
    ];

    expect(rendered[0]).toContain('data-slot="form"');
    expect(rendered[0]).toContain('data-slot="field"');
    expect(rendered[1]).toContain("<fieldset");
    expect(rendered[1]).toContain('data-slot="fieldset-legend"');
    expect(rendered[1]).toContain('data-slot="field"');
    expect(rendered[1]).toContain('data-slot="field-item"');
    expect(rendered[2]).toContain("<fieldset");
    expect(rendered[2]).toContain('data-slot="fieldset-legend"');
    expect(rendered[2]).toContain('data-slot="field"');
    expect(rendered[2]).toContain('data-slot="field-item"');
    expect(rendered[3]).toContain('data-slot="field"');
    expect(rendered[3]).toContain('data-slot="field-label"');
    expect(rendered[4]).toContain('data-slot="form"');
    expect(rendered[4]).toContain('data-slot="fieldset"');
    expect(rendered[4]).toContain('data-slot="fieldset-legend"');
    expect(rendered[4]).toContain('data-slot="field"');
    expect(rendered[4]).toContain('data-slot="field-description"');
    expect(rendered[5]).toContain('data-slot="form"');
    expect(rendered[5]).toContain('data-slot="field"');
  });

  test("documents exact Svelte control prop unions and defaults", () => {
    const button = source("apps/ui/content/docs/components/button.svx");
    const slider = source("apps/ui/content/docs/components/slider.svx");
    const toggle = source("apps/ui/content/docs/components/toggle.svx");
    const toggleGroup = source("apps/ui/content/docs/components/toggle-group.svx");

    expect(button).toContain(
      '`"default" \\| "destructive" \\| "destructive-outline" \\| "ghost" \\| "link" \\| "outline" \\| "secondary"`',
    );
    expect(button).toContain(
      '`"default" \\| "icon" \\| "icon-lg" \\| "icon-sm" \\| "icon-xl" \\| "icon-xs" \\| "lg" \\| "sm" \\| "xl" \\| "xs"`',
    );
    expect(button).toContain('`data-slot="button-loading-indicator"`');
    expect(button).toContain("keeps the child content mounted");

    expect(slider).toContain("`number \\| readonly number[]`");
    expect(slider).toContain('`"push" \\| "swap" \\| "none"`');
    expect(slider).toContain('`"center" \\| "edge"`');
    expect(slider).toContain("| `thumbAlignment`");

    expect(toggle).toContain('`"default" \\| "outline"`');
    expect(toggle).toContain('`"default" \\| "sm" \\| "lg"`');
    expect(toggle).toContain("| `pressed`");
    expect(toggle).toContain("| `onPressedChange`");

    expect(toggleGroup).toContain('`"horizontal" \\| "vertical"`');
    expect(toggleGroup).toContain("| `loopFocus`");
    expect(toggleGroup).toContain("| `multiple`");
    expect(toggleGroup).toContain("| `defaultValue`");
  });

  test("keeps the Hugeicons menu transition and reduced-motion contract", () => {
    const particle = source("apps/ui/registry/default/particles/p-button-39.svelte");

    expect(particle).toContain("Menu01Icon");
    expect(particle).toContain("Cancel01Icon");
    expect(particle).toContain("transition-[transform,opacity]");
    expect(particle).toContain("duration-300");
    expect(particle).toContain("motion-reduce:duration-0");
    expect(particle).toContain('data-menu-icon="menu"');
    expect(particle).toContain('data-menu-icon="cancel"');
    expect(particle).not.toMatch(/<svg\b|lucide/i);
  });

  test("keeps checkbox-group ownership, the radio API route, and theme-card state classes", () => {
    const usage = source("apps/ui/content/docs/components/checkbox-group.svx");
    const radioPage = source("apps/ui/content/docs/components/radio-group.svx");
    const themeRadio = source("apps/ui/registry/default/particles/p-radio-group-6.svelte");

    expect(usage).toContain('<CheckboxGroup.Item value="next" />');
    expect(usage).not.toMatch(/<CheckboxGroup\.Item[^>]*>\s*<Checkbox\b/s);
    expect(radioPage).toContain("https://shardsui.com/svelte/radio");
    expect(radioPage).not.toContain("https://shardsui.com/svelte/radio-group");
    expect(themeRadio).toContain("peer-data-disabled:cursor-not-allowed");
    expect(themeRadio).toContain("peer-data-disabled:opacity-64");
    expect(themeRadio).toContain("peer-data-checked:ring-offset-background");
  });

  test("preserves unchanged COSS guidance with only route and framework adaptations", () => {
    expect(source("apps/ui/content/docs/components/checkbox.svx")).toContain(
      "For accessible labelling and validation, prefer using the `Field` component to wrap checkboxes. See the related example: [Checkbox field](/docs/components/field#checkbox-field).",
    );
    expect(source("apps/ui/content/docs/components/checkbox-group.svx")).toContain(
      "For accessible group labelling and validation, prefer wrapping checkbox groups with `Field` and `Fieldset`. See the related example: [Checkbox group field](/docs/components/field#checkbox-group-field).",
    );
    expect(source("apps/ui/content/docs/components/radio-group.svx")).toContain(
      "A set of checkable buttons where no more than one of the buttons can be checked at a time.",
    );
    expect(source("apps/ui/content/docs/components/radio-group.svx")).toContain(
      "For tabs-style mutually exclusive choices, see the [Segmented Control](/docs/components/segmented-control) pattern.",
    );
    expect(source("apps/ui/content/docs/components/switch.svx")).toContain(
      "The switch size is controlled by the `--thumb-size` CSS variable. By default, the switch uses responsive sizing with `[--thumb-size:--spacing(5)] sm:[--thumb-size:--spacing(4)]` classes, making it slightly larger on mobile devices (like other interactive elements).",
    );
    expect(source("apps/ui/content/docs/components/slider.svx")).toContain(
      "For accessible labelling and validation, prefer using the `Field` component to wrap checkboxes. See the related example: [Slider field](/docs/components/field#slider-field).",
    );
    expect(source("apps/ui/content/docs/components/toggle-group.svx")).toContain(
      "- [Mar 20, 2026](/docs/changelog#toggle-group) — `Toggle` renamed to `ToggleGroupItem`",
    );
  });
});
