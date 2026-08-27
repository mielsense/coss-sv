import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mdsvex } from "mdsvex";
import { compile, preprocess } from "svelte/compiler";
import { describe, expect, test } from "vitest";
import { documentationComponents } from "../../src/lib/content/preprocess.js";

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
      [documentationComponents(), preprocessor],
      { filename: resolve(appRoot, "content/docs/components/accordion.svx") },
    );

    expect(result.code).toContain("import { ApiTable, Callout, CodeSource, ComponentPreview");
    expect(result.code).toContain("import Layout_MDSVEX_DEFAULT");
    const compiled = compile(result.code, { filename: "accordion.svelte", runes: true });
    expect(compiled.js.code).toContain("ComponentPreview");
  });
});
