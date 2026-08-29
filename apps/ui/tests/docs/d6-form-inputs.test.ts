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
    "../../content/docs/components/label.svx",
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
  label: ["p-input-6"],
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

const expectedPageSlugs = Object.keys(expectedPagePreviews);

function source(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

function fencedSvelteBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/```svelte\s*\n([\s\S]*?)```/g)].map(([, code]) => code ?? "");
}

describe("D6 form and input documentation inventory", () => {
  test("preserves the exact COSS page-only Field validity preview override", () => {
    const field = source("apps/ui/content/docs/components/field.svx");
    const previewClass = "[& .preview>*]:w-full [&_.preview>*]:max-w-80";

    expect(field).toMatch(/<ComponentPreview\s+name="p-field-5"[\s\S]*?\/>/);
    expect(field).toContain(`containerClass="${previewClass}"`);
  });

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

  test("compiles and SSR renders all ten D6 pages", () => {
    expect(Object.keys(compiledPages)).toHaveLength(10);
    for (const [path, module] of Object.entries(compiledPages)) {
      const component = (module as { default: Component }).default;
      expect(render(component).body, path).toContain("data-slot=");
    }
  });

  test("omits only the unportable upstream Label preview", () => {
    const label = source("apps/ui/content/docs/components/label.svx");
    const evidence = source("docs/porting/components/label.md");

    expect(label).toContain("### With Checkbox");
    expect(label).not.toContain("checkbox-demo");
    expect(evidence).toContain("no `checkbox-demo` particle exists");
    expect(evidence).toContain("omits only the dangling preview reference");
  });

  test("keeps the locked D6 ownership set exact", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const actual = ownership.ownership
      .filter(({ implementationLane }) => implementationLane === "D6")
      .map(({ particle }) => particle)
      .sort();

    expect(actual).toEqual([...expectedParticles].sort());
  });

  test("exposes every D6 documentation page through a typed route", () => {
    for (const slug of expectedPageSlugs) {
      const routeRoot = `apps/ui/src/routes/docs/components/${slug}`;
      const page = source(`${routeRoot}/+page.svelte`);
      const loader = source(`${routeRoot}/+page.server.ts`);

      expect(page).toContain(`$content/docs/components/${slug}.svx`);
      expect(page).toContain("data.documentation.metadata.title");
      expect(loader).toContain(`generatedDocumentationRecord("components/${slug}")`);
    }
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
    expect(particle).not.toMatch(/from\s+["']@hugeicons\/svelte["']/);
    for (const [icon] of particle.matchAll(/<HugeiconsIcon\b[\s\S]*?\/>/g)) {
      expect(icon).toContain("strokeWidth={2}");
    }
  });

  test.each(Object.keys(expectedPagePreviews))(
    "ports the exact upstream %s page and preview order",
    (slug) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      expect(page).toContain("<InstallCommand");
      expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
      expect(page).not.toMatch(/\b(?:npm|npx|bun|bunx|yarn)\b/);
      expect(page).not.toMatch(/```(?:tsx|jsx)|@base-ui\/react|lucide-react|from ["']react/);
      expect(page).not.toMatch(/from\s+["']@hugeicons\/svelte["']/);

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

  test("preserves Label typography when optional copy renders as a span", () => {
    for (const id of ["p-input-14", "p-textarea-8"]) {
      expect(source(`apps/ui/registry/default/particles/${id}.svelte`)).toContain(
        '<Label as="span" class="font-normal text-muted-foreground">Optional</Label>',
      );
    }
  });

  test("delegates Group text labels through the public Label component", () => {
    for (const id of ["p-group-7", "p-group-8", "p-group-17"]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      expect(particle).toContain("delegate={labelDelegate}");
      expect(particle).toContain("<Label {...props} />");
    }
  });

  test("delegates composed Number Fields to one group element", () => {
    for (const id of ["p-group-14", "p-group-22"]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      expect(particle).toContain("delegate={numberGroup}");
      expect(particle).toContain("<NumberField.Group {...props} />");
    }
  });

  test("preserves the Input Group focus-order alert with the central Hugeicons renderer", () => {
    const page = source("apps/ui/content/docs/components/input-group.svx");
    expect(page).toMatch(
      /import\s*{\s*Alert,\s*AlertDescription,\s*HugeiconsIcon\s*}\s*from\s*"@coss-sv\/ui"/,
    );
    expect(page).toMatch(
      /import\s*{\s*InformationCircleIcon\s*}\s*from\s*"@hugeicons\/core-free-icons"/,
    );
    expect(page).toContain('<Alert class="bg-muted/24">');
    expect(page).toContain(
      '<HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />',
    );
    expect(page).toMatch(
      /For proper focus navigation, the `InputGroup\.Addon` component should be placed after the input\s+in the DOM order\./,
    );
  });

  test("preserves Group nested and separator API examples", () => {
    const page = source("apps/ui/content/docs/components/group.svx");
    expect(page).toContain("Nest multiple groups to create complex layouts with spacing.");
    expect(page).toContain("<Group.Root>\n  <Group.Root>");
    expect(page.match(/<Group\.Separator \/>/g)?.length).toBeGreaterThanOrEqual(8);
    expect(page).toContain("### Group.Separator");
    expect(page).toMatch(
      /### Group\.Separator[\s\S]*?```svelte[\s\S]*?<Group\.Root>[\s\S]*?<Group\.Separator \/>[\s\S]*?<\/Group\.Root>[\s\S]*?```/,
    );
  });

  test("keeps standalone form controls first in the cold production traversal", () => {
    const regression = source("apps/ui/tests/docs/d6-form-inputs.production.browser.mjs");
    expect(regression).toContain("const coldStartParticles = [");
    expect(regression).toContain(
      '["p-input-1", "p-group-1", "p-input-group-1", "p-number-field-1", "p-otp-field-1"]',
    );
    expect(regression).toMatch(/assert\.doesNotMatch\(\s*html,\s*\/missing_context\/i/);
    expect(regression).toContain('implementationLane === "D6"');
    expect(regression).toContain('await openParticle("p-field-1")');
  });
});
