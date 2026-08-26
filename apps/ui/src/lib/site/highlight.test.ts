import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { highlightCode } from "./highlight.js";

describe("Shiki multi-theme output", () => {
  test("emits light and dark variables for every token presentation property", async () => {
    const output = await highlightCode("***bold italic***\n~~strike~~", "markdown");

    for (const property of ["", "-font-style", "-font-weight", "-text-decoration"]) {
      expect(output).toContain(`--shiki-light${property}:`);
      expect(output).toContain(`--shiki-dark${property}:`);
    }
  });

  test("maps every light and dark token variable to a rendered CSS property", async () => {
    const css = await readFile(new URL("../../app.css", import.meta.url), "utf8");
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
