import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

type Rgb = [red: number, green: number, blue: number];

const css = await readFile(new URL("../../app.css", import.meta.url), "utf8");

function rgb(hex: string): Rgb {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)) as Rgb;
}

function luminance(color: Rgb): number {
  const [red, green, blue] = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (red ?? 0) + 0.7152 * (green ?? 0) + 0.0722 * (blue ?? 0);
}

function contrast(foreground: string, background: string): number {
  const values = [luminance(rgb(foreground)), luminance(rgb(background))];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

describe("documentation color contracts", () => {
  test("keeps Svelte orange scoped to the site chrome", () => {
    expect(css).toMatch(/\.site-shell\s*\{[^}]*--site-primary:\s*#ff3e00;/s);
    expect(css).not.toMatch(/(^|\n)\s*--primary:\s*#ff3e00/);
    expect(css).toContain("--thumb-primary-to: var(--primary);");
    expect(css).toMatch(
      /\.site-button\[data-primary="true"\]\s*\{[^}]*background:\s*var\(--site-primary\);/s,
    );
  });

  test.each([
    ["light body text", "#272727", "#fafafa"],
    ["light muted text", "#686868", "#fafafa"],
    ["light primary action", "#fff8f5", "#c93200"],
    ["dark body text", "#f4f4f4", "#111111"],
    ["dark muted text", "#9d9d9d", "#111111"],
  ])("%s clears WCAG AA", (_label, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  test("defines explicit light and dark component tokens", () => {
    expect(css).toMatch(/\.site-shell\s*\{[^}]*--site-background:\s*#fafafa;/s);
    expect(css).toMatch(/html\.dark \.site-shell\s*\{[^}]*--site-background:\s*#111111;/s);
    expect(css).toMatch(
      /html\.dark \.site-shell\s*\{[^}]*--site-muted:\s*var\(--muted-foreground\);/s,
    );
    expect(css).toMatch(/html\.dark\s*\{[^}]*--muted-foreground:\s*#818181;/s);
  });
});

describe("documentation layout and interaction contracts", () => {
  test("locks the measured COSS hero and card geometry", () => {
    expect(css).toMatch(/\.hero\s*\{[^}]*padding-block:\s*2rem;/s);
    expect(css).toMatch(
      /@media \(min-width: 48rem\)[\s\S]*?\.hero\s*\{[^}]*padding-block:\s*3rem;/,
    );
    expect(css).toMatch(
      /@media \(min-width: 64rem\)[\s\S]*?\.hero\s*\{[^}]*padding-block:\s*4rem;/,
    );
    expect(css).not.toMatch(/\.hero-section\s*\{[^}]*min-height:/s);
    expect(css).toMatch(/\.category-preview\s*\{[^}]*min-height:\s*13\.75rem;/s);
    expect(css).toMatch(/\.category-preview\s*\{[^}]*overflow-x:\s*auto;/s);
    expect(css).toMatch(/\.category-thumbnail\s*\{[^}]*padding:\s*1\.5rem 2rem;/s);
  });

  test("uses the exact COSS type metrics and separately licensed heading face", () => {
    const rootRule = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";
    const headingRule = css.match(/\.hero h1,[\s\S]*?\{([^}]*)\}/)?.[1] ?? "";

    expect(css).toContain('font-family: "Cal Sans";');
    expect(css).toContain('src: url("/fonts/cal-sans/CalSansVF.woff2") format("woff2");');
    expect(css).toMatch(/body\s*\{[^}]*font-family:[^}]*"Cal Sans"/s);
    expect(css).toMatch(/\.hero h1,[\s\S]*?font-family:\s*"Cal Sans"/);
    expect(css).not.toMatch(/\.hero h1[^}]*letter-spacing:/s);
    expect(rootRule).not.toContain("font-variation-settings");
    expect(headingRule).not.toContain("font-variation-settings");
    expect(css).toMatch(
      /\.category-card p\s*\{[^}]*font-size:\s*0\.875rem;[^}]*line-height:\s*1\.25rem;/s,
    );
  });

  test("uses the upstream responsive column progression", () => {
    expect(css).toMatch(/@media \(min-width: 40rem\)[\s\S]*repeat\(2,/);
    expect(css).toMatch(/@media \(min-width: 64rem\)[\s\S]*repeat\(3,/);
    expect(css).toMatch(/@media \(min-width: 80rem\)[\s\S]*repeat\(4,/);
  });

  test("keeps the COSS container gutters and neutral preview tokens", () => {
    expect(css).toMatch(
      /\.site-container\s*\{[^}]*max-width:\s*88\.5rem;[^}]*padding-inline:\s*1rem;/s,
    );
    expect(css).toMatch(
      /@media \(min-width: 64rem\)[\s\S]*?\.site-container\s*\{[^}]*padding-inline:\s*1\.5rem;/,
    );
    expect(css).toMatch(/\.category-preview\s*\{[^}]*--btn-to:\s*var\(--primary\)/s);
    expect(css).not.toMatch(/\.category-preview\s*\{[^}]*--site-primary/s);
  });

  test("matches COSS button, badge, and fixed marker behavior", () => {
    expect(css).toMatch(/\.hero-actions\s*\{[^}]*display:\s*flex;[^}]*gap:\s*0\.5rem;/s);
    expect(css).not.toMatch(/\.hero-actions\s*\{[^}]*flex-wrap:/s);
    expect(css).toMatch(
      /\.site-button\s*\{[^}]*border-radius:\s*0\.625rem;[^}]*font-weight:\s*500;/s,
    );
    expect(css).toMatch(/\.site-button\s*\{[^}]*white-space:\s*nowrap;/s);
    expect(css).toMatch(/\.site-button\[data-primary="true"\]\s*\{[^}]*box-shadow:[^}]*inset/s);
    expect(css).toMatch(/\.site-button:active,[\s\S]*?\.site-button\[data-pressed="true"\]/);
    expect(css).toMatch(
      /\.new-badge\s*\{[^}]*height:\s*1\.125rem;[^}]*background:\s*var\(--info-muted\);/s,
    );
    expect(css).toMatch(/\.header-markers\s*\{[^}]*position:\s*fixed;/s);
  });

  test("keeps visible focus and reduced-motion fallbacks", () => {
    expect(css).toContain("outline: 2px solid var(--site-primary);");
    expect(css).toContain("outline-offset: 3px;");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).not.toMatch(
      /:focus-visible\s*\{[^}]*(?:outline:\s*none|outline-color:\s*transparent)/s,
    );
  });
});
