import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as Ui from "@coss-sv/ui";
import { compile } from "svelte/compiler";
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
const Command = Ui.Command;

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

  test("uses registry installs, local aliases, Svelte source, and Hugeicons only", async () => {
    const currentSvelteGuides = guideRoutes.filter((slug) => slug !== "changelog");
    const text = (
      await Promise.all([...currentSvelteGuides, ...hookRecords].map((slug) => source(slug)))
    ).join("\n");
    const changelog = await source("changelog");
    const sveltePortStatus = changelog.slice(changelog.indexOf("## Svelte port status"));

    expect(text).toContain("pnpm dlx shadcn-svelte@latest");
    expect(text).toContain("$lib/components/ui/");
    expect(text).not.toContain("@/");
    expect(text).not.toContain('from "@coss-sv/ui"');
    expect(text).toContain("npx skills add mielsense/coss-sv --skill coss-svelte");
    expect(text).toContain("HugeiconsIcon");
    expect(text).not.toMatch(/```(?:tsx|jsx)\b/);
    expect(text.replace("npx skills add mielsense/coss-sv --skill coss-svelte", "")).not.toMatch(
      /\b(?:bun|bunx|npm|npx|yarn)\b/,
    );
    expect(text).not.toContain("lucide");
    expect(text).not.toContain("@hugeicons/svelte");
    expect(text).not.toContain("@base-ui/react");
    expect(text).not.toContain('from "react"');
    expect(sveltePortStatus).toContain("pnpm dlx shadcn-svelte@latest");
    expect(sveltePortStatus).not.toMatch(/\b(?:bun|bunx|npm|npx|yarn)\b/);
  });

  test("ports both hooks with Svelte-native reactive contracts", async () => {
    const mediaQuery = await source("hooks-use-media-query");
    const clipboard = await source("hooks-use-copy-to-clipboard");

    expect(mediaQuery).toContain('useMediaQuery("md")');
    expect(mediaQuery).toContain('useMediaQuery({ max: "md", pointer: "coarse" })');
    expect(mediaQuery).toContain("useIsMobile");
    expect(mediaQuery).toContain("Viewport &lt; breakpoint");
    expect(mediaQuery).not.toContain("Viewport < breakpoint");
    expect(mediaQuery).not.toContain('<ComponentSource name="use-media-query"');
    expect(clipboard).toContain("useCopyToClipboard");
    expect(clipboard).not.toContain('<ComponentSource name="use-copy-to-clipboard"');
  });

  test("keeps the COSS source boundary and Miel attribution visible", async () => {
    const credits = await readFile(
      resolve(appRoot, "src/routes/(site)/credits/+page.svelte"),
      "utf8",
    );
    expect(credits).toContain("Unofficial Svelte port made by");
    expect(credits).toContain("19620ae8cae81e30775f2cde03829326cb4916b2");
    expect(credits).toContain("reference/apps/ui");
    expect(credits).toContain("not endorsed by COSS");
  });

  test("documents the exported Command dialog API instead of a nonexistent namespace part", async () => {
    const migration = await source("radix-migration");
    const commandSection = migration.match(/### Command\n([\s\S]*?)\n### Menu/)?.[1] ?? "";
    const runnableExample = commandSection.match(/```svelte\n([\s\S]*?)\n```/)?.[1] ?? "";

    expect(Command.DialogRoot).toBeDefined();
    expect(Command.CommandDialog).toBe(Command.DialogRoot);
    expect(Command.DialogTrigger).toBeDefined();
    expect(Command.DialogPopup).toBeDefined();
    expect("CommandDialog" in Ui).toBe(false);
    expect(migration).not.toMatch(/Command\.Dialog(?:[\s`,]|$)/);
    expect(commandSection).not.toMatch(/named (?:package-)?root alias/i);
    expect(runnableExample).toContain("Command.DialogRoot");
    expect(runnableExample).toContain("Command.DialogTrigger");
    expect(runnableExample).toContain("Command.DialogPopup");
    expect(runnableExample).toContain("type CommandItem");
    expect(runnableExample).toContain("Command.Group");
    expect(runnableExample).toContain("Command.Collection");
    expect(runnableExample).toContain("Command.Item");
    expect(runnableExample).not.toContain("...");
    expect(() =>
      compile(runnableExample, {
        filename: "CommandMigrationExample.svelte",
        generate: "server",
      }),
    ).not.toThrow();
  });

  test("preserves every exact upstream changelog agent prompt before separate port notes", async () => {
    const changelog = await source("changelog");
    const prompts = [
      ...changelog.matchAll(/\*\*Agent migration prompt:\*\*\s*\n\n```text\n([\s\S]*?)\n```/g),
    ].map(([, prompt]) =>
      createHash("sha256")
        .update(prompt ?? "")
        .digest("hex"),
    );

    expect(prompts).toEqual([
      "6ffa7214e9fba34ea39e23d61d85c238d6fc0bbf20489750ecf1b29786f30d82",
      "2475ddb39bd9036f83722262214fffeb6f35ff53f89cf5483805c4fa4e2f8477",
      "6149c2bd480d6ca905961a4b6110c2d4d353afa915d7537742b4a2fd10fb88c1",
      "3f4e9d26acf6b9c45a1b942ceb345fd267e39512ae51206bfee11a9e5fb46098",
      "0fbd7b6680c39c53488ea243699bba672471a1bdf97b9bcc0769cfdb8aa28a5d",
      "f735d7da451fcba30260fa83455a6d9d4ab7d6cc098198b1d6479e9b5a0787c4",
      "ebf904d19148688706adc8d782826f931c353026a8fbb8df0c7ed3273b3b4ede",
      "39978aabf426ff4f86427688e44550343c870400d066c1627d5401f8ec066765",
      "187816cf02b524f45a3ef01a71569b4f80cef1819dd1457c0c91190721ad6015",
    ]);
    expect(changelog.indexOf("## Upstream COSS history")).toBeLessThan(
      changelog.indexOf("## Svelte port status"),
    );
  });

  test("separates the upstream roadmap from Svelte port status", async () => {
    const roadmap = await source("roadmap");

    expect(roadmap.indexOf("## Upstream COSS roadmap")).toBeLessThan(
      roadmap.indexOf("## Svelte port status"),
    );
    expect(roadmap).toContain("## Origin UI");
    expect(roadmap).toContain("## Current Status");
    expect(roadmap).toContain("## What’s Next");
  });

  test("keeps copy feedback restartable without changing its accessible text", async () => {
    const button = await readFile(
      resolve(appRoot, "src/lib/content/guides/CopyMarkdownButton.svelte"),
      "utf8",
    );
    const clipboard = await source("hooks-use-copy-to-clipboard");
    const clipboardHook = await readFile(
      resolve(appRoot, "registry/default/hooks/use-copy-to-clipboard.svelte.ts"),
      "utf8",
    );
    const mediaDemo = await readFile(
      resolve(appRoot, "src/lib/content/guides/MediaQueryDemo.svelte"),
      "utf8",
    );

    expect(button).toContain("$effect(() =>");
    expect(button).toContain("void url");
    expect(button).toContain("return () =>");
    expect(button).toContain("clearTimeout(timer)");
    expect(button).toContain("new AbortController()");
    expect(button).toContain("controller?.abort()");
    expect(button).toContain("generation");
    expect(button).toContain("{ signal: controller.signal }");
    expect(button).toContain("Copy Markdown");
    expect(button).not.toMatch(/copied\s*\?\s*["']Copied["']/);
    expect(clipboard).toContain('aria-hidden="true"');
    expect(clipboardHook).toContain("navigator.clipboard.writeText");
    expect(clipboardHook).toContain("clearTimeout(resetTimer)");
    expect(clipboardHook).toContain("onDestroy");
    expect(clipboardHook).toContain("destroyed = true");
    expect(mediaDemo).toContain('title: "Device & preferences"');
  });

  test("keeps authored Skills and Get Started prose free of inline-header and dash tells", async () => {
    for (const slug of ["skills", "get-started"] as const) {
      const guide = await source(slug);
      expect(guide).not.toContain("—");
      expect(guide).not.toMatch(/^\s*(?:[-*]|\d+\.)\s+\*\*[^*]+\*\*\s*(?::|[-–—])/m);
    }
  });
});
