import { describe, expect, test } from "vitest";
import {
  compileDocs as compileDocumentation,
  type CompileDocsOptions,
  type SourcePage,
} from "../../src/lib/content/compiler.js";

function compileDocs(options: CompileDocsOptions) {
  return compileDocumentation(options);
}

const accordionSource = `---
title: Accordion
description: A set of collapsible panels with headings and content.
links:
  api: https://shardsui.com/svelte/accordion
---

# Accordion

<ComponentPreview name="p-accordion-1" align="start" />

## Usage {#usage}

\`\`\`svelte
<script lang="ts">
  import * as Accordion from "@/components/ui/accordion";
</script>

<Accordion.Root>
  <Accordion.Item value="item-1">Item</Accordion.Item>
</Accordion.Root>
\`\`\`

<InstallCommand
  shadcnSvelte="pnpm dlx shadcn-svelte@latest add https://example.com/r/accordion.json"
/>
`;

const buttonSource = `---
title: Button
description: A button or a component that looks like a button.
---

# Button

## API Reference
`;

const pages: SourcePage[] = [
  { kind: "component", slug: "accordion", source: accordionSource },
  { kind: "component", slug: "button", source: buttonSource },
];
const accordionPage = pages[0] as SourcePage;

describe("documentation compiler", () => {
  test("preserves frontmatter and upstream metadata order", async () => {
    const result = await compileDocs({
      order: ["button", "accordion"],
      pages,
      particleIds: new Set(["p-accordion-1"]),
    });

    expect(result.pages.map(({ slug }) => slug)).toEqual(["button", "accordion"]);
    expect(result.pages[1]?.metadata).toEqual({
      description: "A set of collapsible panels with headings and content.",
      links: { api: "https://shardsui.com/svelte/accordion" },
      title: "Accordion",
    });
  });

  test("highlights Svelte without changing copied source", async () => {
    const result = await compileDocs({
      order: ["accordion", "button"],
      pages,
      particleIds: new Set(["p-accordion-1"]),
    });
    const block = result.bySlug.get("accordion")?.codeBlocks[0];

    expect(block?.language).toBe("svelte");
    expect(block?.raw).toContain('import * as Accordion from "@/components/ui/accordion";');
    expect(block?.palette.length).toBeLessThan(block?.lines.flat().length ?? 0);
    expect(
      block?.lines
        .flat()
        .some(
          (token) => block.palette[token[1]]?.light.color !== block.palette[token[1]]?.dark.color,
        ),
    ).toBe(true);
  });

  test("resolves previews and exposes the registry install command", async () => {
    const result = await compileDocs({
      order: ["accordion", "button"],
      pages,
      particleIds: new Set(["p-accordion-1"]),
    });
    const accordion = result.bySlug.get("accordion");

    expect(accordion?.previews[0]).toMatchObject({
      align: "start",
      id: "p-accordion-1",
    });
    expect(accordion?.installCommands).toEqual([
      {
        shadcnSvelte: "pnpm dlx shadcn-svelte@latest add https://example.com/r/accordion.json",
      },
    ]);
    expect(Object.keys(accordion?.installCommands[0] ?? {})).toEqual(["shadcnSvelte"]);
  });

  test("accepts typed Svelte API metadata and preserves heading IDs for Markdown routes", async () => {
    const result = await compileDocs({
      api: {
        accordion: [
          {
            description: "Controls whether the item is expanded.",
            name: "open",
            required: false,
            type: "boolean",
          },
        ],
      },
      order: ["accordion", "button"],
      pages,
      particleIds: new Set(["p-accordion-1"]),
    });
    const accordion = result.bySlug.get("accordion");

    expect(accordion?.api[0]).toMatchObject({ name: "open", type: "boolean" });
    expect(accordion?.tableOfContents).toEqual([
      { depth: 1, id: "accordion", text: "Accordion" },
      { depth: 2, id: "usage", text: "Usage" },
    ]);
    expect(accordion?.markdown).toContain("## Usage {#usage}");
  });

  test("excludes fenced code headings from the table of contents", async () => {
    const source = `---
title: Fences
description: Heading fence coverage.
---

# Visible

\`\`\`markdown
## Example only
\`\`\`

## Also visible`;
    const result = await compileDocs({
      order: ["fences"],
      pages: [{ kind: "root", slug: "fences", source }],
      particleIds: new Set(),
    });

    expect(result.pages[0]?.tableOfContents).toEqual([
      { depth: 1, id: "visible", text: "Visible" },
      { depth: 2, id: "also-visible", text: "Also visible" },
    ]);
  });

  test("de-duplicates repeated Button headings with one document-local slug sequence", async () => {
    const source = `---
title: Button
description: Button heading coverage.
---

# Button

## Link

## Examples

### Link`;
    const result = await compileDocs({
      order: ["button"],
      pages: [{ kind: "component", slug: "button", source }],
      particleIds: new Set(),
    });

    expect(result.pages[0]?.tableOfContents).toEqual([
      { depth: 1, id: "button", text: "Button" },
      { depth: 2, id: "link", text: "Link" },
      { depth: 2, id: "examples", text: "Examples" },
      { depth: 3, id: "link-1", text: "Link" },
    ]);
  });

  test.each([
    {
      error: /unknown particle p-accordion-404/,
      options: {
        order: ["accordion"],
        pages: [
          {
            kind: "component" as const,
            slug: "accordion",
            source: accordionSource.replace("p-accordion-1", "p-accordion-404"),
          },
        ],
        particleIds: new Set(["p-accordion-1"]),
      },
    },
    {
      error: /duplicate documentation slug accordion/,
      options: {
        order: ["accordion"],
        pages: [accordionPage, accordionPage],
        particleIds: new Set(["p-accordion-1"]),
      },
    },
    {
      error: /React source is not allowed/,
      options: {
        order: ["accordion"],
        pages: [
          {
            kind: "component" as const,
            slug: "accordion",
            source: accordionSource.replace(
              "```svelte",
              '```tsx\nimport * as React from "react";\n```\n\n```svelte',
            ),
          },
        ],
        particleIds: new Set(["p-accordion-1"]),
      },
    },
  ])("fails invalid source records", async ({ error, options }) => {
    await expect(compileDocs(options)).rejects.toThrow(error);
  });

  test.each([
    ["shadcnSvelte", "npm exec shadcn-svelte@latest add accordion", /must use pnpm/],
    ["shadcnSvelte", "pnpm dlx shadcn@latest add accordion", /must use shadcn-svelte/],
    ["shadcnSvelte", "pnpm dlx shadcn-svelte@latest add react", /must not install React/],
  ] as const)("rejects invalid %s install command semantics", async (attribute, command, error) => {
    const invalid = accordionSource.replace(
      'shadcnSvelte="pnpm dlx shadcn-svelte@latest add https://example.com/r/accordion.json"',
      `${attribute}="${command}"`,
    );

    await expect(
      compileDocs({
        order: ["accordion"],
        pages: [{ kind: "component", slug: "accordion", source: invalid }],
        particleIds: new Set(["p-accordion-1"]),
      }),
    ).rejects.toThrow(error);
  });
});
