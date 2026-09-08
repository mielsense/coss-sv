import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { highlightSource } from "../code/highlight.js";
import PackageManagerCommand from "../content/components/PackageManagerCommand.svelte";
import { highlightCode } from "./highlight.js";

describe("Shiki multi-theme output", () => {
  test("gives installation command frames the shared code surface in both themes", async () => {
    const css = await readFile(new URL("../../styles/content.css", import.meta.url), "utf8");
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      const { body } = render(PackageManagerCommand, {
        props: { commands: [{ command: "pnpm add example", value: "pnpm" }] },
      });
      await page.setContent(`<style>
        :root { --color-white: #fff; --background: #fff; --foreground: #262626; }
        html.dark { --background: #141414; --foreground: #fafafa; }
        .bg-code { background: var(--code); color: var(--code-foreground); }
        ${css}
      </style>${body}`);
      for (const dark of [false, true]) {
        const colors = await page.evaluate((dark) => {
          document.documentElement.classList.toggle("dark", dark);
          const frame = document.querySelector(".bg-code") as HTMLElement;
          const styles = getComputedStyle(frame);
          const sample = document.createElement("div");
          sample.style.background = dark ? "color-mix(in srgb, #141414 98%, #fff)" : "#fff";
          document.body.append(sample);
          const expectedBackground = getComputedStyle(sample).backgroundColor;
          sample.remove();
          return {
            background: styles.backgroundColor,
            foreground: styles.color,
            expectedBackground,
          };
        }, dark);
        expect(colors.background).toBe(colors.expectedBackground);
        expect(colors.foreground).toBe(dark ? "rgb(250, 250, 250)" : "rgb(38, 38, 38)");
      }
    } finally {
      await browser.close();
    }
  });

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
