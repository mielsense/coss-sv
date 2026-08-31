import { existsSync, readdirSync, readFileSync } from "node:fs";
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

const cardNamespaceParticles = [
  ...expectedParticles.filter((id) => id.startsWith("p-card-")),
  "p-table-6",
  "p-table-7",
  "p-table-8",
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

const expectedExternalPackages: Record<(typeof pages)[number], readonly string[]> = {
  accordion: [],
  card: ["@hugeicons/core-free-icons"],
  collapsible: [],
  empty: ["@hugeicons/core-free-icons"],
  frame: [],
  separator: [],
  skeleton: [],
  tabs: [],
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
  if (!specifier || specifier.startsWith("@/") || /^(?:\.|\/|\$|#|node:)/.test(specifier)) {
    return undefined;
  }
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

function normalizedCopy(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function expectClassPropTable(section: { body: string; heading: string }): void {
  expect(section.body, `${section.heading} should retain its prop table`).toMatch(
    /\|\s*Prop\s*\|\s*Type\s*\|\s*Default\s*\|/,
  );
  expect(section.body, `${section.heading} should document class`).toMatch(
    /\|\s*`class`\s*\|\s*`string`\s*\|\s*\|/,
  );
}

describe("D4 disclosure and surface documentation inventory", () => {
  test("keeps consumer documentation on registry-local imports and namespace composition", () => {
    const contentDirectory = resolve(appRoot, "content/docs/components");

    for (const entry of readdirSync(contentDirectory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".svx")) continue;
      const page = readFileSync(resolve(contentDirectory, entry.name), "utf8");
      expect(page, entry.name).not.toMatch(/\bfrom ["']@coss-sv\/ui(?:\/[^"']*)?["']/);

      for (const [, namespace] of page.matchAll(
        /import \* as ([A-Za-z][A-Za-z0-9]*) from ["']@\/components\/ui\/[^"']+\/index\.js["']/g,
      )) {
        expect(page, `${entry.name}: unused ${namespace} namespace`).toContain(`<${namespace}.`);
      }
    }
  });

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
      expect(particle).toContain('from "@hugeicons/core-free-icons/');
      expect(particle).not.toContain("@hugeicons/svelte");
      expect(particle).toContain("<HugeiconsIcon");
    }
  });

  test.each(pages)("ports the exact upstream %s page and preview order", (slug) => {
    const contentPath = `apps/ui/content/docs/components/${slug}.svx`;
    const routePath = `apps/ui/src/routes/(site)/docs/components/${slug}/+page.svelte`;
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
    const cardPage = source("apps/ui/content/docs/components/card.svx");
    expect(cardPage).toContain('import * as Card from "@/components/ui/card/index.js";');
    expect(cardPage).toContain("<Card.Root>");
    expect(cardPage).toContain("<Card.Header>");
    expect(cardPage).toContain("<Card.Panel>Content</Card.Panel>");
    expect(cardPage).not.toMatch(/<\/?Card(?:Header|Title|Description|Action|Panel|Footer)\b/);
    expect(source("apps/ui/content/docs/components/separator.svx")).toContain(
      "https://shardsui.com/svelte/separator",
    );
  });

  test.each(cardNamespaceParticles)("uses the public Card namespace in %s", (id) => {
    const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
    expect(particle).toContain('import * as Card from "@coss-sv/ui/components/ui/card";');
    expect(particle).not.toMatch(
      /<\/?Card(?=[\s>])|<\/?Card(?:Header|Title|Description|Action|Panel|Content|Footer|Frame|FrameHeader|FrameTitle|FrameDescription|FrameAction|FrameFooter)\b/,
    );
  });

  test("uses the public Card namespace in the Table parity fixture", () => {
    const fixture = source("apps/ui/src/lib/parity/components/table.svelte");
    expect(fixture).toContain(
      'import * as Card from "../../../../../../packages/ui/dist/components/ui/card/index.js";',
    );
    expect(fixture).toContain("<Card.Frame");
    expect(fixture).not.toMatch(/<\/?CardFrame(?:Footer)?\b/);
  });

  test("keeps all seven upstream Empty API examples in their exact section order", () => {
    const page = source("apps/ui/content/docs/components/empty.svx");
    const [usage] = fencedSvelteBlocks(page);
    const apiReference = page.slice(page.indexOf("## API Reference"));
    const sections = levelThreeSections(apiReference);

    expect(sections.map(({ heading }) => heading)).toEqual([
      "Empty.Root",
      "Empty.Header",
      "Empty.Media",
      "Empty.Title",
      "Empty.Description",
      "Empty.Content",
    ]);
    expect(sections.map(({ body }) => fencedSvelteBlocks(body).length)).toEqual([1, 1, 2, 1, 1, 1]);

    const examples = sections.flatMap(({ body }) => fencedSvelteBlocks(body));
    expect(examples).toHaveLength(7);
    expect(examples[0]).toContain("<Empty.Root>");
    expect(examples[0]).toContain("<Empty.Header />");
    expect(examples[0]).toContain("<Empty.Content />");
    expect(examples[1]).toContain("<Empty.Header>");
    expect(examples[1]).toContain("<Empty.Media />");
    expect(examples[2]).toContain('<Empty.Media variant="icon">');
    expect(examples[2]).toContain("<HugeiconsIcon");
    expect(examples[3]).toContain("<Avatar.Root>");
    expect(examples[3]).toContain('<Avatar.Image src="..." />');
    expect(examples[3]).toContain("<Avatar.Fallback>JD</Avatar.Fallback>");
    expect(examples[4]).toContain("<Empty.Title>No data</Empty.Title>");
    expect(examples[5]).toContain(
      "<Empty.Description>You do not have any notifications.</Empty.Description>",
    );
    expect(examples[6]).toContain("<Empty.Content>");
    expect(examples[6]).toContain("<Button>Add Project</Button>");
    expect(examples.filter((example) => example.includes("<HugeiconsIcon"))).toEqual([examples[2]]);
    expect(usage).toContain("import * as Avatar");
    expect(usage).toContain("import * as Empty");
    expect(page).not.toContain('from "@coss-sv/ui"');
  });

  test("keeps the complete Empty API copy and all six prop tables", () => {
    const page = source("apps/ui/content/docs/components/empty.svx");
    const apiReference = page.slice(page.indexOf("## API Reference"));
    const sections = levelThreeSections(apiReference);
    const expectedDescriptions = [
      "The main component of the empty state. Wraps the `Empty.Header` and `Empty.Content` components.",
      "The `Empty.Header` component wraps the empty media, title, and description.",
      "Use the `Empty.Media` component to display the media of the empty state such as an icon or an image. You can also use it to display other components such as an avatar.",
      "Use the `Empty.Title` component to display the title of the empty state.",
      "Use the `Empty.Description` component to display the description of the empty state.",
      "Use the `Empty.Content` component to display the content of the empty state such as a button, input or a link.",
    ];

    expect(normalizedCopy(apiReference)).toContain(
      normalizedCopy(
        "The API follows [shadcn/ui's empty component](https://ui.shadcn.com/docs/components/empty), adapted to Svelte namespace composition.",
      ),
    );
    expect(sections.map(({ heading }) => heading)).toEqual([
      "Empty.Root",
      "Empty.Header",
      "Empty.Media",
      "Empty.Title",
      "Empty.Description",
      "Empty.Content",
    ]);
    sections.forEach((section, index) => {
      expect(normalizedCopy(section.body)).toContain(
        normalizedCopy(expectedDescriptions[index] ?? "missing description"),
      );
      expectClassPropTable(section);
    });
    expect(sections[2]?.body).toContain('| `variant` | `"default" \\| "icon"` | `default` |');
  });

  test("keeps every Card and CardFrame part description plus the Svelte as contract", () => {
    const page = source("apps/ui/content/docs/components/card.svx");
    const apiReference = page.slice(page.indexOf("## API Reference"));
    const sections = levelThreeSections(apiReference);
    const expectedSections = [
      ["Card.Root", "Root container for the card. Supports the `as` prop."],
      ["Card.Header", "Header section container. Supports the `as` prop."],
      ["Card.Title", "Title text for the card. Supports the `as` prop."],
      ["Card.Description", "Description text for the card. Supports the `as` prop."],
      [
        "Card.Action",
        "Container for action buttons in the header. Automatically positions to the right. Supports the `as` prop.",
      ],
      [
        "Card.Panel",
        "Main content area of the card. Also exported as `Card.Content`. Supports the `as` prop.",
      ],
      ["Card.Footer", "Footer section for the card. Supports the `as` prop."],
      ["Card.Frame", "Root container for the framed card layout. Supports the `as` prop."],
      [
        "Card.FrameHeader",
        "Header section for the frame. Contains title, description, and optionally `Card.FrameAction`. Supports the `as` prop.",
      ],
      ["Card.FrameTitle", "Title text for the frame. Supports the `as` prop."],
      ["Card.FrameDescription", "Description text for the frame. Supports the `as` prop."],
      [
        "Card.FrameAction",
        'Container for action buttons (e.g. "Add", "Edit") in the header. Place it as a sibling of `Card.FrameTitle` and `Card.FrameDescription` inside `Card.FrameHeader`. It is positioned in the top-right via CSS grid (`col-start-2`, `row-span-2`, `self-center`, `justify-self-end`). Use it for primary actions that apply to the entire frame. Supports the `as` prop.',
      ],
      ["Card.FrameFooter", "Footer section for the frame. Supports the `as` prop."],
    ] as const;

    expect(normalizedCopy(apiReference)).toContain(
      "This is a custom component using a polymorphic Svelte `as` prop, not a direct Shards UI wrapper.",
    );
    expect(normalizedCopy(apiReference)).toContain(
      normalizedCopy(
        "`Card.Frame` is an alternative layout for cards that groups a header, content, and footer with consistent styling and clipping. Use it when you need a framed card with optional header actions.",
      ),
    );
    expect(sections.map(({ heading }) => heading)).toEqual(
      expectedSections.map(([heading]) => heading),
    );
    sections.forEach((section, index) => {
      expect(normalizedCopy(section.body)).toContain(
        normalizedCopy(expectedSections[index]?.[1] ?? "missing description"),
      );
    });
    expect(sections[0]?.body).toContain(
      '| `as` | `keyof HTMLElementTagNameMap` | `"div"` | Render as a different element |',
    );
  });

  test("keeps all six Frame descriptions and class prop tables", () => {
    const page = source("apps/ui/content/docs/components/frame.svx");
    const apiReference = page.slice(page.indexOf("## API Reference"));
    const sections = levelThreeSections(apiReference).slice(0, 6);
    const expectedDescriptions = [
      "The main container component for grouping related information.",
      "A panel container for frame content.",
      "Header section for the frame.",
      "Title text for the frame header.",
      "Description text for the frame header.",
      "Footer section for the frame.",
    ];

    expect(sections.map(({ heading }) => heading)).toEqual([
      "Frame.Root",
      "Frame.Panel",
      "Frame.Header",
      "Frame.Title",
      "Frame.Description",
      "Frame.Footer",
    ]);
    sections.forEach((section, index) => {
      expect(normalizedCopy(section.body)).toContain(
        normalizedCopy(expectedDescriptions[index] ?? "missing description"),
      );
      expectClassPropTable(section);
    });
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
    const apiReferenceStart = body.search(/<h2[^>]*id="api-reference"/);
    expect(apiReferenceStart).toBeGreaterThanOrEqual(0);
    const apiReference = body.slice(apiReferenceStart);

    for (const id of [
      "empty-root",
      "empty-header",
      "empty-media",
      "empty-title",
      "empty-description",
      "empty-content",
    ]) {
      expect(apiReference).toMatch(new RegExp(`<h3[^>]*id="${id}"`));
    }
    expect(apiReference.match(/<pre class="shiki shiki-themes/g)).toHaveLength(7);
    for (const component of [
      "Empty",
      "Header",
      "Media",
      "Avatar",
      "Title",
      "Description",
      "Content",
      "Button",
    ]) {
      expect(apiReference).toContain(`>${component}</span>`);
    }
    expect(apiReference).toContain("You do not have any notifications.");
    expect(apiReference).toContain("Add Project");
  });

  test("preserves the exact COSS visible copy in every accordion particle", () => {
    for (const id of ["p-accordion-1", "p-accordion-2", "p-accordion-3", "p-accordion-4"]) {
      const particle = source(`apps/ui/registry/default/particles/${id}.svelte`);
      const visibleCopy = particle.replace(/\s+/g, " ");

      expect(visibleCopy).toContain("What is Base UI?");
      expect(visibleCopy).toContain(
        "Base UI is a library of high-quality unstyled React components for design systems and web apps.",
      );
      expect(visibleCopy).toContain("Of course! Base UI is free and open source.");
      expect(visibleCopy).not.toMatch(/ShardsUI|headless, accessible Svelte 5 components/);
    }
  });

  test.each(pages)(
    "uses registry-local aliases and declares only external imports on the %s page",
    (slug) => {
      const page = source(`apps/ui/content/docs/components/${slug}.svx`);
      const install = /<InstallCommand\s+shadcnSvelte="([^"]+)"\s*\/>/.exec(page);
      const displayedImports = displayedSvelteImports(page);
      const displayedPackages = [
        ...new Set(displayedImports.map(barePackageName).filter((value) => value !== undefined)),
      ];

      expect(install?.[1]).toBe(
        `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/${slug}.json`,
      );
      expect(displayedImports.length).toBeGreaterThan(0);
      expect(displayedImports.filter((specifier) => specifier.startsWith("@/"))).not.toHaveLength(
        0,
      );
      expect(displayedPackages.toSorted()).toEqual(expectedExternalPackages[slug].toSorted());
    },
  );

  test("publishes the tabs landing route with the D9-owned primary preview", () => {
    const ownership = JSON.parse(source("docs/porting/docs-ownership.json")) as OwnershipFile;
    const primaryPreview = ownership.ownership.find(({ particle }) => particle === "p-tabs-1");

    expect(primaryPreview).toMatchObject({
      implementationLane: "D9",
      primaryPage: "components/segmented-control",
    });
    expect(existsSync(resolve(repositoryRoot, primaryPreview?.targetPath ?? "missing"))).toBe(true);
    expect(
      existsSync(
        resolve(repositoryRoot, "apps/ui/src/routes/(site)/docs/components/tabs/+page.svelte"),
      ),
    ).toBe(true);
  });
});
