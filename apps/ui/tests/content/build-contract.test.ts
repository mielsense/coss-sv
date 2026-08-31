import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

describe("documentation compiler build contract", () => {
  test("runs the content compiler before every site validation and build entry point", async () => {
    const packageJson = JSON.parse(
      await readFile(new URL("../../package.json", import.meta.url), "utf8"),
    ) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.["docs:compile"]).toBe("tsx scripts/docs/compile.mts --write");
    for (const script of ["build", "check", "test", "test:unit"]) {
      expect(packageJson.scripts?.[script], script).toMatch(/^pnpm docs:compile && /);
    }
  });

  test("serves every page's metadata from the generated content index", async () => {
    const [loader, layout, route, source] = await Promise.all([
      readFile(new URL("../../src/routes/(site)/docs/+layout.server.ts", import.meta.url), "utf8"),
      readFile(new URL("../../src/routes/(site)/docs/+layout.svelte", import.meta.url), "utf8"),
      readFile(new URL("../../src/routes/(site)/docs/+page.svelte", import.meta.url), "utf8"),
      readFile(new URL("../../content/docs/introduction.svx", import.meta.url), "utf8"),
    ]);

    expect(loader).toContain("findGeneratedDocumentationRecord");
    expect(loader).toContain('return "introduction"');
    expect(layout).toContain("documentation.metadata.title");
    expect(layout).toContain("documentation.metadata.description");
    expect(route).toContain("$content/docs/introduction.svx");
    expect(source).not.toContain("<svelte:head>");
  });

  test("projects generated page data to metadata and the table of contents", async () => {
    const generatedServer = await readFile(
      new URL("../../src/lib/content/generated.server.ts", import.meta.url),
      "utf8",
    );

    expect(generatedServer).toContain("DocumentationPageData");
    expect(generatedServer).toContain("docs-index.json");
    expect(generatedServer).not.toContain("docs-content.json");
    expect(generatedServer).toContain("metadata: record.metadata");
    expect(generatedServer).toContain("tableOfContents: record.tableOfContents");
  });

  test("runs the production PreviewCard browser contract from the docs E2E gate", async () => {
    const packageJson = JSON.parse(
      await readFile(new URL("../../package.json", import.meta.url), "utf8"),
    ) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.["test:e2e"]).toContain("preview-card.browser.mjs");
  });
});
