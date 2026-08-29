import { resolve } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";
import { compileDocumentationTree } from "../../scripts/docs/compile.mts";
import {
  createLlmsFullText,
  createLlmsIndex,
  createMarkdownDocument,
  findDocumentationRecord,
} from "../../src/lib/server/documentation-text.js";
import { GET as getMarkdown } from "../../src/routes/docs/[...slug].md/+server.js";
import { GET as getLlmsFull } from "../../src/routes/llms-full.txt/+server.js";
import { GET as getLlms } from "../../src/routes/llms.txt/+server.js";

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");

let records: Awaited<ReturnType<typeof compileDocumentationTree>>["pages"];

describe("agent-readable documentation", () => {
  beforeAll(async () => {
    records = (
      await compileDocumentationTree({
        contentRoot: resolve(appRoot, "content/docs"),
        ownershipPath: resolve(repositoryRoot, "docs/porting/docs-ownership.json"),
      })
    ).pages;
  }, 15_000);

  test("indexes canonical Markdown routes for guides, components, and hooks", async () => {
    const index = createLlmsIndex(records);

    expect(index).toContain("# COSS for Svelte");
    expect(index).toContain("https://coss-sv.vercel.app/docs/get-started.md");
    expect(index).toContain("https://coss-sv.vercel.app/docs/components/accordion.md");
    expect(index).toContain("https://coss-sv.vercel.app/docs/hooks/use-media-query.md");
    expect(index).toContain("Unofficial Svelte port made by Miel");
  });

  test("serves the same content record through page-level Markdown", async () => {
    const record = findDocumentationRecord(records, "get-started");
    expect(record).toBeDefined();
    if (!record) throw new Error("missing get-started documentation record");

    const markdown = createMarkdownDocument(record, "get-started");
    expect(markdown).toContain("# Get Started");
    expect(markdown).toContain("pnpm dlx shadcn-svelte@latest init");
    expect(markdown).toContain("https://coss-sv.vercel.app/docs/get-started");
    expect(markdown).not.toContain("CopyMarkdownButton");
  });

  test("includes complete page bodies in llms-full.txt", async () => {
    const full = createLlmsFullText(records);
    expect(full).toContain("## Document: Get Started");
    expect(full).toContain("## Document: Accordion");
    expect(full).toContain("## Document: useMediaQuery");
    expect(full).toContain("<Accordion.Root>");
  });

  test("serves text routes with stable content types and 404s", async () => {
    const llms = await getLlms({} as never);
    const full = await getLlmsFull({} as never);
    const guide = await getMarkdown({ params: { slug: "get-started" } } as never);
    const missing = await getMarkdown({ params: { slug: "missing" } } as never);

    for (const response of [llms, full, guide]) {
      expect(response.headers.get("content-type")).toMatch(/^text\/plain;\s*charset=utf-8$/i);
      expect(response.headers.get("cache-control")).toBe("public, max-age=0, must-revalidate");
    }
    expect(await llms.text()).toContain("/docs/hooks/use-copy-to-clipboard.md");
    expect(await full.text()).toContain("# Full documentation");
    expect(await guide.text()).toContain("# Get Started");
    expect(missing.status).toBe(404);
  });
});
