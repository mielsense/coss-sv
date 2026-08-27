import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

const themeTokens = [
  "--animate-skeleton",
  "--color-accent",
  "--color-accent-foreground",
  "--color-background",
  "--color-border",
  "--color-card",
  "--color-card-foreground",
  "--color-destructive",
  "--color-destructive-foreground",
  "--color-foreground",
  "--color-info",
  "--color-info-foreground",
  "--color-input",
  "--color-muted",
  "--color-muted-foreground",
  "--color-popover",
  "--color-popover-foreground",
  "--color-primary",
  "--color-primary-foreground",
  "--color-ring",
  "--color-secondary",
  "--color-secondary-foreground",
  "--color-sidebar",
  "--color-sidebar-accent",
  "--color-sidebar-accent-foreground",
  "--color-sidebar-border",
  "--color-sidebar-foreground",
  "--color-sidebar-primary",
  "--color-sidebar-primary-foreground",
  "--color-sidebar-ring",
  "--color-success",
  "--color-success-foreground",
  "--color-warning",
  "--color-warning-foreground",
  "--font-heading",
  "--font-mono",
  "--font-sans",
  "--radius-lg",
  "--radius-md",
  "--radius-sm",
  "--radius-xl",
].sort();

const semanticTokens = [
  "--accent",
  "--accent-foreground",
  "--background",
  "--border",
  "--card",
  "--card-foreground",
  "--destructive",
  "--destructive-foreground",
  "--foreground",
  "--info",
  "--info-foreground",
  "--input",
  "--muted",
  "--muted-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--radius",
  "--ring",
  "--secondary",
  "--secondary-foreground",
  "--sidebar",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-ring",
  "--success",
  "--success-foreground",
  "--warning",
  "--warning-foreground",
].sort();

function blockContents(source: string, selector: string): string {
  const selectorIndex = source.indexOf(selector);
  if (selectorIndex < 0) {
    throw new Error(`Missing CSS block: ${selector}`);
  }

  const openingBrace = source.indexOf("{", selectorIndex + selector.length);
  if (openingBrace < 0) {
    throw new Error(`Missing opening brace for CSS block: ${selector}`);
  }

  let depth = 1;
  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  throw new Error(`Missing closing brace for CSS block: ${selector}`);
}

function customPropertyNames(source: string): string[] {
  return Array.from(source.matchAll(/^\s*(--[\w-]+)\s*:/gm))
    .flatMap((match) => (match[1] ? [match[1]] : []))
    .sort();
}

describe("package surface", () => {
  test("exports Separator from the package root", async () => {
    const { Separator, SeparatorPrimitive } = await import("@coss-sv/ui");

    expect(Separator).toBeTypeOf("function");
    expect(SeparatorPrimitive).toBeTypeOf("function");
  }, 60_000);

  test("exports the class-name utility through the package subpath", async () => {
    const packageSubpath = "@coss-sv/ui/lib/utils";
    const { cn } = (await import(packageSubpath)) as typeof import("../src/lib/utils.js");

    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });

  test("exports the neutral token stylesheet through the package subpath", async () => {
    const stylesheetUrl = import.meta.resolve("@coss-sv/ui/styles/globals.css");
    const stylesheet = await readFile(fileURLToPath(stylesheetUrl), "utf8");

    expect(stylesheet).toContain("--primary: var(--color-neutral-800)");
    expect(stylesheet).toContain("--primary: var(--color-neutral-100)");
    expect(stylesheet).not.toContain("#ff3e00");
  });

  test("matches the complete permitted COSS theme token and skeleton contract", async () => {
    const stylesheetUrl = import.meta.resolve("@coss-sv/ui/styles/globals.css");
    const stylesheet = await readFile(fileURLToPath(stylesheetUrl), "utf8");

    expect(customPropertyNames(blockContents(stylesheet, "@theme inline"))).toEqual(themeTokens);
    expect(customPropertyNames(blockContents(stylesheet, ":root"))).toEqual(semanticTokens);
    expect(customPropertyNames(blockContents(stylesheet, "\n.dark"))).toEqual(
      semanticTokens.filter((token) => token !== "--radius"),
    );
    expect(stylesheet).toContain("--animate-skeleton: skeleton 2s -1s infinite linear;");
    expect(blockContents(stylesheet, "@keyframes skeleton").replace(/\s+/g, " ").trim()).toBe(
      "to { background-position: -200% 0; }",
    );
    expect(stylesheet).not.toMatch(/--(?:color-)?(?:chart|code)(?:-|:)/);
  });

  test("pins the published Shards UI beta without a local protocol", async () => {
    const manifest = JSON.parse(await readFile(`${packageRoot}/package.json`, "utf8")) as {
      dependencies: Record<string, string>;
    };
    const shardsVersion = manifest.dependencies["@shardsui/svelte"];

    expect(shardsVersion).toBe("0.1.0-beta.0");
    expect(shardsVersion).not.toMatch(/^(?:file|link|workspace):/);
  });
});
