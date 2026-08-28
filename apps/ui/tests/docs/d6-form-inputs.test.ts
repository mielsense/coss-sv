import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Component } from "svelte";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";

const compiledParticles = import.meta.glob(
  [
    "../../registry/default/particles/p-field-*.svelte",
    "../../registry/default/particles/p-fieldset-*.svelte",
    "../../registry/default/particles/p-form-*.svelte",
    "../../registry/default/particles/p-group-*.svelte",
    "../../registry/default/particles/p-input-*.svelte",
    "../../registry/default/particles/p-input-group-*.svelte",
    "../../registry/default/particles/p-number-field-*.svelte",
    "../../registry/default/particles/p-otp-field-*.svelte",
    "../../registry/default/particles/p-textarea-*.svelte",
  ],
  { eager: true },
);

const compiledPages = import.meta.glob(
  [
    "../../content/docs/components/input.svx",
    "../../content/docs/components/textarea.svx",
    "../../content/docs/components/field.svx",
    "../../content/docs/components/fieldset.svx",
    "../../content/docs/components/form.svx",
    "../../content/docs/components/group.svx",
    "../../content/docs/components/input-group.svx",
    "../../content/docs/components/number-field.svx",
    "../../content/docs/components/otp-field.svx",
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

const range = (prefix: string, start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => `${prefix}-${start + index}`);

const expectedParticles = [
  ...range("p-field", 1, 18),
  "p-fieldset-1",
  ...range("p-form", 1, 2),
  ...range("p-group", 1, 20),
  "p-group-22",
  "p-group-23",
  ...range("p-input", 1, 11),
  ...range("p-input", 13, 19),
  ...range("p-input-group", 1, 24),
  ...range("p-input-group", 26, 29),
  ...range("p-number-field", 1, 11),
  ...range("p-otp-field", 1, 4),
  ...range("p-otp-field", 6, 10),
  ...range("p-textarea", 1, 15),
] as const;

const expectedPagePreviews = {
  input: [
    "p-input-1",
    "p-input-2",
    "p-input-3",
    "p-input-4",
    "p-input-5",
    "p-input-6",
    "p-input-7",
    "p-form-1",
  ],
  label: ["p-input-6", "checkbox-demo"],
  textarea: range("p-textarea", 1, 6),
  field: range("p-field", 1, 18),
  fieldset: ["p-fieldset-1"],
  form: ["p-form-1", "p-form-2"],
  group: range("p-group", 1, 14),
  "input-group": [
    "p-input-group-1",
    "p-input-group-2",
    "p-input-group-3",
    "p-input-group-4",
    "p-input-group-5",
    "p-input-group-7",
    "p-input-group-8",
    "p-input-group-9",
    "p-input-group-10",
    "p-input-group-11",
    "p-input-group-12",
    "p-input-group-13",
    "p-input-group-14",
    "p-input-group-15",
    "p-input-group-16",
    "p-input-group-6",
    "p-input-group-17",
  ],
  "number-field": range("p-number-field", 1, 10),
  "otp-field": [
    "p-otp-field-1",
    "p-otp-field-2",
    "p-otp-field-3",
    "p-otp-field-4",
    "p-otp-field-6",
    "p-otp-field-7",
    "p-otp-field-8",
    "p-otp-field-9",
    "p-otp-field-10",
  ],
} as const;

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

function fencedSvelteBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/```svelte\s*\n([\s\S]*?)```/g)].map(([, code]) => code ?? "");
}

describe("D6 form and input documentation inventory", () => {
  test("compiles the exact 124 owned Svelte particles", () => {
    expect(Object.keys(compiledParticles)).toHaveLength(124);
  });

  test("SSR renders every owned particle without throwing", () => {
    for (const [path, module] of Object.entries(compiledParticles)) {
      const component = (module as { default: Component }).default;
      const body = render(component).body;
      expect(body, path).toContain("data-slot=");
    }
  });

  test("compiles and SSR renders the nine pages without the confirmed upstream label seam", () => {
    expect(Object.keys(compiledPages)).toHaveLength(9);
    for (const [path, module] of Object.entries(compiledPages)) {
      const component = (module as { default: Component }).default;
      expect(render(component).body, path).toContain("data-slot=");
    }
  });

  test("preserves the exact missing upstream label example as a coordinator seam", () => {
    const label = source("apps/ui/content/docs/components/label.svx");
    expect(label).toContain('<ComponentPreview name="checkbox-demo" />');
    expect(
      existsSync(
        resolve(repositoryRoot, "reference/apps/ui/registry/default/particles/checkbox-demo.tsx"),
      ),
    ).toBe(false);
  });

  test("keeps the locked D6 ownership set exact", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const actual = ownership.ownership
      .filter(({ implementationLane }) => implementationLane === "D6")
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
    expect(particle).not.toMatch(/lucide|<svg\b|<path\b/i);
  });

  test.each(Object.keys(expectedPagePreviews))(
    "ports the exact upstream %s page and preview order",
    (slug) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect(page).toContain("<InstallCommand");
      expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
      expect(page).not.toMatch(/\b(?:npm|npx|bun|bunx|yarn)\b/);
      expect(page).not.toMatch(/```(?:tsx|jsx)|@base-ui\/react|lucide-react|from ["']react/);

      const previews = [...page.matchAll(/<ComponentPreview\s+name="([^"]+)"/g)].map(
        ([, id]) => id,
      );
      expect(previews).toEqual(expectedPagePreviews[slug as keyof typeof expectedPagePreviews]);

      for (const [index, example] of fencedSvelteBlocks(page).entries()) {
        expect(() =>
          compile(example, {
            filename: `${slug}-displayed-example-${index}.svelte`,
            generate: "client",
          }),
        ).not.toThrow();
      }
    },
  );

  test("uses public Svelte namespaces and exact registry installation commands", () => {
    for (const slug of Object.keys(expectedPagePreviews)) {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect(page).toContain(
        `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/${slug}.json`,
      );
    }

    expect(source("apps/ui/content/docs/components/field.svx")).toContain("<Field.Root>");
    expect(source("apps/ui/content/docs/components/fieldset.svx")).toContain("<Fieldset.Root>");
    expect(source("apps/ui/content/docs/components/number-field.svx")).toContain(
      "<NumberField.Root",
    );
    expect(source("apps/ui/content/docs/components/otp-field.svx")).toContain("<OTPField.Root");
  });
});
