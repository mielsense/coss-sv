import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mdsvex } from "mdsvex";
import { compile, preprocess } from "svelte/compiler";
import { describe, expect, test } from "vitest";
import { compileDocs } from "../../src/lib/content/compiler.js";
import {
  documentationComponents,
  documentationHeadings,
  modernizeDocumentationOutput,
} from "../../src/lib/content/preprocess.js";

const appRoot = fileURLToPath(new URL("../..", import.meta.url));
const layout = resolve(appRoot, "src/lib/content/DocumentationLayout.svelte");

describe("documentation MDsveX layout", () => {
  test("injects shared documentation components without page-local imports", async () => {
    const preprocessor = mdsvex({
      extensions: [".svx"],
      layout,
      layoutPropForwarding: "runes",
    });
    const result = await preprocess(
      `---\ntitle: Accordion\ndescription: Accordion documentation.\n---\n\n<ComponentPreview name="p-accordion-1" />`,
      [documentationComponents(), preprocessor, modernizeDocumentationOutput()],
      { filename: resolve(appRoot, "content/docs/components/accordion.svx") },
    );

    expect(result.code).toContain("import { ApiTable, Callout, CodeSource, ComponentPreview");
    expect(result.code).toContain(
      '<ComponentPreview name="p-accordion-1" loader={__cossParticleLoader0} source={__cossParticleSource0} />',
    );
    expect(result.code).toContain(
      'const __cossParticleLoader0 = () => import("$particles/p-accordion-1.svelte");',
    );
    expect(result.code).toContain("const __cossParticleSource0 =");
    expect(result.code).toContain("$lib/components/ui/accordion/index.js");
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

  test("resolves inline component source blocks from the generated registry", async () => {
    const filename = resolve(appRoot, "content/docs/components/segmented-control.svx");
    const source = `---
title: Segmented Control
description: Shared segmented control styles.
---

<ComponentSource name="segmented-control" title="lib/segmented-control.ts" />`;
    const transformed = await documentationComponents().markup?.({ content: source, filename });

    expect(transformed?.code).not.toContain("<ComponentSource");
    expect(transformed?.code).toContain(
      '<CodeSource source={__cossInlineComponentSource0} title="lib/segmented-control.ts" />',
    );
    expect(transformed?.code).toContain("const __cossInlineComponentSource0");
    expect(transformed?.code).toContain("segmentedControlItemVariants");
  });

  test("embeds manual installation files instead of requesting them in the browser", async () => {
    const filename = resolve(appRoot, "content/docs/components/accordion.svx");
    const source = `---
title: Accordion
description: Accordion documentation.
---

<InstallCommand shadcnSvelte="pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/accordion.json" />`;
    const transformed = await documentationComponents().markup?.({ content: source, filename });

    expect(transformed?.code).toContain("files={__cossInstallFiles0}");
    expect(transformed?.code).toContain("dependencies={__cossInstallDependencies0}");
    expect(transformed?.code).toContain("const __cossInstallFiles0 =");
    expect(transformed?.code).toContain("components/ui/accordion/");
    expect(transformed?.code).not.toContain("registryNames=");
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
    expect(result.code).toContain(
      '<LinkedHeading id="root-api" level="2">API <code>Root</code></LinkedHeading>',
    );
    expect(result.code).not.toContain("{#root-api}");
    compile(result.code, { filename: "accordion.svelte", runes: true });

    const compiledDocs = await compileDocs({
      order: ["accordion"],
      pages: [{ kind: "component", slug: "accordion", source }],
      particleIds: new Set(),
    });
    const renderedIds = Array.from(
      result.code.matchAll(/<(?:h[1-6]|LinkedHeading) id="([^"]+)"/g),
      (match) => String(match[1]),
    );
    expect(renderedIds).toEqual(compiledDocs.pages[0]?.tableOfContents.map(({ id }) => id));
  });

  test("wraps Markdown tables in the responsive documentation table", async () => {
    const source = `---
title: Input Group
description: Input group API.
---

| Prop | Type |
| --- | --- |
| align | \`"inline-start" \\| "inline-end"\` |`;
    const result = await preprocess(
      source,
      [
        documentationComponents(),
        mdsvex({
          extensions: [".svx"],
          remarkPlugins: [documentationHeadings],
        }),
      ],
      { filename: resolve(appRoot, "content/docs/components/input-group.svx") },
    );

    expect(result.code).toMatch(/<DocsTable>\s*<thead>/);
    expect(result.code).not.toContain("<table>");
    compile(result.code, { filename: "input-group.svelte", runes: true });
  });

  test("matches compiler duplicate heading ids without leaking slugs between documents", async () => {
    const preprocessor = mdsvex({
      extensions: [".svx"],
      remarkPlugins: [documentationHeadings],
    });
    const source = `---
title: Button
description: Button heading coverage.
---

# Button

## Link

### Link`;
    const process = (filename: string) =>
      preprocess(source, [documentationComponents(), preprocessor], { filename });
    const [first, second, compiledDocs] = await Promise.all([
      process(resolve(appRoot, "content/docs/components/button.svx")),
      process(resolve(appRoot, "content/docs/components/link-button.svx")),
      compileDocs({
        order: ["button"],
        pages: [{ kind: "component", slug: "button", source }],
        particleIds: new Set(),
      }),
    ]);

    const ids = (code: string) =>
      Array.from(code.matchAll(/<(?:h[1-6]|LinkedHeading) id="([^"]+)"/g), (match) =>
        String(match[1]),
      );
    expect(ids(first.code)).toEqual(["button", "link", "link-1"]);
    expect(ids(second.code)).toEqual(["button", "link", "link-1"]);
    expect(ids(first.code)).toEqual(compiledDocs.pages[0]?.tableOfContents.map(({ id }) => id));
  });
});
