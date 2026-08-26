import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

describe("package surface", () => {
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

  test("pins the published Shards UI beta without a local protocol", async () => {
    const manifest = JSON.parse(await readFile(`${packageRoot}/package.json`, "utf8")) as {
      dependencies: Record<string, string>;
    };
    const shardsVersion = manifest.dependencies["@shardsui/svelte"];

    expect(shardsVersion).toBe("0.1.0-beta.0");
    expect(shardsVersion).not.toMatch(/^(?:file|link|workspace):/);
  });
});
