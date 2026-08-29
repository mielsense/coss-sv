import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { compileDocumentationTree } from "../../scripts/docs/compile.mts";

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");

const guideRoutes = [
  "introduction",
  "get-started",
  "styling",
  "radix-migration",
  "skills",
  "changelog",
  "roadmap",
] as const;

const hookRecords = ["hooks-use-media-query", "hooks-use-copy-to-clipboard"] as const;

async function source(name: string): Promise<string> {
  return readFile(resolve(appRoot, `content/docs/${name}.svx`), "utf8");
}

describe("D11 guide sources", () => {
  test("compiles all seven root pages and both Svelte hook replacements", async () => {
    const compiled = await compileDocumentationTree({
      contentRoot: resolve(appRoot, "content/docs"),
      ownershipPath: resolve(repositoryRoot, "docs/porting/docs-ownership.json"),
    });

    for (const slug of [...guideRoutes, ...hookRecords]) {
      expect(compiled.bySlug.has(slug), `missing content record ${slug}`).toBe(true);
    }
  });

  test("uses pnpm, shadcn-svelte, Svelte source, and Hugeicons only", async () => {
    const text = (
      await Promise.all([...guideRoutes, ...hookRecords].map((slug) => source(slug)))
    ).join("\n");

    expect(text).toContain("pnpm dlx shadcn-svelte@latest");
    expect(text).toContain("@coss-sv/ui");
    expect(text).toContain("HugeiconsIcon");
    expect(text).not.toMatch(/```(?:tsx|jsx)\b/);
    expect(text).not.toMatch(/\b(?:bun|bunx|npm|npx|yarn)\b/);
    expect(text).not.toContain("lucide");
    expect(text).not.toContain("@hugeicons/svelte");
    expect(text).not.toContain("@base-ui/react");
    expect(text).not.toContain('from "react"');
  });

  test("documents native Svelte replacements instead of inventing package hooks", async () => {
    const mediaQuery = await source("hooks-use-media-query");
    const clipboard = await source("hooks-use-copy-to-clipboard");

    expect(mediaQuery).toContain('import { MediaQuery } from "svelte/reactivity"');
    expect(mediaQuery).toMatch(/does\s+not export a `useMediaQuery` hook/);
    expect(clipboard).toMatch(/does\s+not export a `useCopyToClipboard` hook/);
    expect(clipboard).toContain("navigator.clipboard.writeText");
  });

  test("keeps the COSS source boundary and Miel attribution visible", async () => {
    const credits = await readFile(resolve(appRoot, "src/routes/credits/+page.svelte"), "utf8");
    expect(credits).toContain("Unofficial Svelte port made by");
    expect(credits).toContain("19620ae8cae81e30775f2cde03829326cb4916b2");
    expect(credits).toContain("reference/apps/ui");
    expect(credits).toContain("not endorsed by COSS");
  });
});
