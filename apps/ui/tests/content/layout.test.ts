import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mdsvex } from "mdsvex";
import { compile, preprocess } from "svelte/compiler";
import { describe, expect, test } from "vitest";
import { compileDocs } from "../../src/lib/content/compiler.js";
import { highlightSource } from "../../src/lib/code/highlight.js";
import {
  documentationComponents,
  documentationHeadings,
  modernizeDocumentationOutput,
} from "../../src/lib/content/preprocess.js";

const appRoot = fileURLToPath(new URL("../..", import.meta.url));
const layout = resolve(appRoot, "src/lib/content/DocumentationLayout.svelte");

describe("documentation MDsveX layout", () => {
  test("injects shared documentation components without page-local imports", async () => {
    const particleSource = await highlightSource(
      '<script lang="ts">\nlet open = $state(false);\n</script>',
      "svelte",
    );
    const preprocessor = mdsvex({
      extensions: [".svx"],
      layout,
      layoutPropForwarding: "runes",
    });
    const result = await preprocess(
      `---\ntitle: Accordion\ndescription: Accordion documentation.\n---\n\n<ComponentPreview name="p-accordion-1" />`,
      [
        documentationComponents({ loadParticleSource: async () => particleSource }),
        preprocessor,
        modernizeDocumentationOutput(),
      ],
      { filename: resolve(appRoot, "content/docs/components/accordion.svx") },
    );

    expect(result.code).toContain("import { ApiTable, Callout, CodeSource, ComponentPreview");
    expect(result.code).toContain("$state(false)");
    expect(result.code).toMatch(/<ComponentPreview name="p-accordion-1" source=\{[^}]+\}/);
    expect(result.code).toContain("import Layout_MDSVEX_DEFAULT");
    expect(result.code).toContain("<script module>");
    expect(result.code).not.toContain('context="module"');
    const compiled = compile(result.code, { filename: "accordion.svelte", runes: true });
    expect(compiled.js.code).toContain("ComponentPreview");
  });

  test("keeps frontmatter first and merges imports into the existing instance script", async () => {
    const filename = resolve(appRoot, "content/docs/components/accordion.svx");
    const source = `---
title: Accordion
description: Accordion documentation.
---

<script lang="ts">
let count = $state(0);
</script>

# Accordion`;
    const transformed = await documentationComponents().markup?.({ content: source, filename });

    expect(transformed?.code).toMatch(/^---\n[\s\S]*?\n---\n/);
    expect(
      transformed?.code.match(/<script(?![^>]*(?:\bmodule\b|context=["']module))[\s>]/g),
    ).toHaveLength(1);
    expect(transformed?.code).toContain(
      '<script lang="ts">\nimport { ApiTable, Callout, CodeSource, ComponentPreview',
    );
    expect(transformed?.code).toContain("let count = $state(0);");

    const result = await preprocess(
      source,
      [
        documentationComponents(),
        mdsvex({
          extensions: [".svx"],
          layout,
          layoutPropForwarding: "runes",
          remarkPlugins: [documentationHeadings],
        }),
      ],
      { filename },
    );
    expect(result.code).toContain('export const metadata = {"title":"Accordion"');
    expect(compile(result.code, { filename: "accordion.svelte", runes: true }).js.code).toContain(
      "count",
    );
  });

  test("renders heading ids from the compiler slug and removes explicit id syntax", async () => {
    const source =
      "---\ntitle: Accordion\ndescription: Accordion documentation.\n---\n\n# Accordion\n\n## API `Root` {#root-api}";
    const result = await preprocess(
      source,
      [
        documentationComponents(),
        mdsvex({
          extensions: [".svx"],
          remarkPlugins: [documentationHeadings],
        }),
      ],
      { filename: resolve(appRoot, "content/docs/components/accordion.svx") },
    );

    expect(result.code).toContain('<h1 id="accordion">Accordion</h1>');
    expect(result.code).toContain('<h2 id="root-api">API <code>Root</code></h2>');
    expect(result.code).not.toContain("{#root-api}");
    compile(result.code, { filename: "accordion.svelte", runes: true });

    const compiledDocs = await compileDocs({
      order: ["accordion"],
      pages: [{ kind: "component", slug: "accordion", source }],
      particleIds: new Set(),
    });
    const renderedIds = Array.from(result.code.matchAll(/<h[1-6] id="([^"]+)"/g), (match) =>
      String(match[1]),
    );
    expect(renderedIds).toEqual(compiledDocs.pages[0]?.tableOfContents.map(({ id }) => id));
  });
});
