import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { compileDocumentationTree } from "../../scripts/docs/compile.mts";

let fixtureRoot = "";
let contentRoot = "";
let ownershipPath = "";

function source(title: string, body = ""): string {
  return `---\ntitle: ${title}\ndescription: ${title} documentation.\n---\n\n# ${title}\n\n${body}`;
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "coss-sv-docs-"));
  contentRoot = join(fixtureRoot, "content");
  ownershipPath = join(fixtureRoot, "ownership.json");
  await Promise.all(
    ["(root)", "components", "hooks"].map((directory) =>
      mkdir(join(contentRoot, directory), { recursive: true }),
    ),
  );
  await Promise.all([
    writeFile(join(contentRoot, "(root)/meta.json"), JSON.stringify({ pages: ["index"] })),
    writeFile(join(contentRoot, "components/meta.json"), JSON.stringify({ pages: ["button"] })),
    writeFile(join(contentRoot, "hooks/meta.json"), JSON.stringify({ pages: ["use-media-query"] })),
    writeFile(join(contentRoot, "(root)/index.svx"), source("Introduction")),
    writeFile(
      join(contentRoot, "components/button.svx"),
      source("Button", '<ComponentPreview name="p-button-1" />'),
    ),
    writeFile(join(contentRoot, "hooks/use-media-query.svx"), source("useMediaQuery")),
    writeFile(ownershipPath, JSON.stringify({ ownership: [{ particle: "p-button-1" }] })),
  ]);
});

afterEach(async () => {
  await rm(fixtureRoot, { force: true, recursive: true });
});

describe("documentation tree compiler", () => {
  test("builds root, component, and hook records from metadata order", async () => {
    const compiled = await compileDocumentationTree({ contentRoot, ownershipPath });

    expect(compiled.pages.map(({ kind, slug }) => ({ kind, slug }))).toEqual([
      { kind: "root", slug: "" },
      { kind: "component", slug: "components/button" },
      { kind: "hook", slug: "hooks/use-media-query" },
    ]);
    expect(compiled.bySlug.get("components/button")?.previews).toEqual([
      { align: "center", id: "p-button-1" },
    ]);
  });

  test("fails when metadata references a page that is not on disk", async () => {
    await writeFile(
      join(contentRoot, "components/meta.json"),
      JSON.stringify({ pages: ["button", "missing"] }),
    );

    await expect(compileDocumentationTree({ contentRoot, ownershipPath })).rejects.toThrow(
      /missing documentation source/,
    );
  });
});
