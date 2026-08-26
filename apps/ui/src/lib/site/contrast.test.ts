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
    expect(css).toContain("--thumb-primary-to: #ff3e00;");
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
    expect(css).toMatch(/html\.dark \.site-shell\s*\{[^}]*--site-muted:\s*#9d9d9d;/s);
  });
});

describe("documentation layout and interaction contracts", () => {
  test("locks the measured COSS hero and card geometry", () => {
    expect(css).toMatch(/\.hero-section\s*\{\s*min-height:\s*19\.5rem;/);
    expect(css).toMatch(
      /@media \(min-width: 40rem\)[\s\S]*?\.category-card\s*\{[^}]*height:\s*19\.75rem;/,
    );
    expect(css).toMatch(/\.category-preview\s*\{[^}]*height:\s*13\.75rem;/s);
  });

  test("uses the upstream responsive column progression", () => {
    expect(css).toMatch(/@media \(min-width: 40rem\)[\s\S]*repeat\(2,/);
    expect(css).toMatch(/@media \(min-width: 64rem\)[\s\S]*repeat\(3,/);
    expect(css).toMatch(/@media \(min-width: 80rem\)[\s\S]*repeat\(4,/);
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
