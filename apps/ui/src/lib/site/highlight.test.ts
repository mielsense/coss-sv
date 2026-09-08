import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { highlightSource } from "../code/highlight.js";
import { highlightCode } from "./highlight.js";

describe("Shiki multi-theme output", () => {
  test("matches the pinned COSS light theme in Markdown and source previews", async () => {
    const raw = 'const greeting = "hello";';
    const output = await highlightCode(raw, "typescript");
    const source = await highlightSource(raw, "typescript");

    expect(output).toContain("github-light-default");
    expect(output).toContain("--shiki-light:#CF222E");
    expect(source.palette.some((style) => style.light.color === "#CF222E")).toBe(true);
    expect(source.palette.some((style) => style.dark.color === "#F97583")).toBe(true);
  });

  test("emits light and dark variables for every token presentation property", async () => {
    const output = await highlightCode("***bold italic***\n~~strike~~", "markdown");

    for (const property of ["", "-font-style", "-font-weight", "-text-decoration"]) {
      expect(output).toContain(`--shiki-light${property}:`);
      expect(output).toContain(`--shiki-dark${property}:`);
    }
    expect(output).toContain('<div class="docs-code-block">');
    expect(output).toContain("<CopyButton value={");
  });

  test("maps every light and dark token variable to a rendered CSS property", async () => {
    const css = await readFile(new URL("../../styles/content.css", import.meta.url), "utf8");
    const mappings = [
      ["color", ""],
      ["font-style", "-font-style"],
      ["font-weight", "-font-weight"],
      ["text-decoration", "-text-decoration"],
    ] as const;

    for (const [property, suffix] of mappings) {
      expect(css).toContain(`${property}: var(--shiki-light${suffix});`);
      expect(css).toContain(`${property}: var(--shiki-dark${suffix});`);
    }
  });
});
