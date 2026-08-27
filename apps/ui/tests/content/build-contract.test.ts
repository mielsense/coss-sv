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

  test("serves page metadata from the generated content record", async () => {
    const [loader, route, source] = await Promise.all([
      readFile(new URL("../../src/routes/docs/+page.server.ts", import.meta.url), "utf8"),
      readFile(new URL("../../src/routes/docs/+page.svelte", import.meta.url), "utf8"),
      readFile(new URL("../../content/docs/introduction.svx", import.meta.url), "utf8"),
    ]);

    expect(loader).toContain('generatedDocumentationRecord("introduction")');
    expect(route).toContain("data.documentation.metadata.title");
    expect(route).toContain("data.documentation.metadata.description");
    expect(source).not.toContain("<svelte:head>");
  });
});
