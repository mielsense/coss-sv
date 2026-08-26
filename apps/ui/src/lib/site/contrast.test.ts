import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

const css = await readFile(new URL("../../app.css", import.meta.url), "utf8");

function relativeLuminance(hex: string): number {
  if (!/^#[\da-f]{6}$/i.test(hex)) {
    throw new Error(`Expected a six-digit hex color, received ${hex}`);
  }

  const linearChannel = (offset: number) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linearChannel(1) + 0.7152 * linearChannel(3) + 0.0722 * linearChannel(5);
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function tokenBlock(pattern: RegExp): Record<string, string> {
  const block = pattern.exec(css)?.[1];

  if (!block) {
    throw new Error(`Could not find token block ${pattern}`);
  }

  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => [match[1], match[2]]),
  );
}

describe("documentation color contrast", () => {
  const light = tokenBlock(/\.site-shell\s*\{([\s\S]*?)\n\}/);
  const dark = {
    ...light,
    ...tokenBlock(
      /@media \(prefers-color-scheme: dark\)\s*\{[\s\S]*?\.site-shell\s*\{([\s\S]*?)\n\s{2}\}/,
    ),
  };

  test("keeps Svelte orange as the primary brand color", () => {
    expect(light["site-primary"]).toBe("#ff3e00");
    expect(dark["site-primary"]).toBe("#ff3e00");
  });

  test.each([
    ["light accent on page", light["site-accent-foreground"], light["site-background"]],
    ["light accent on panel", light["site-accent-foreground"], light["site-panel"]],
    ["light muted text", light["site-muted"], light["site-background"]],
    ["light text on primary", light["site-primary-foreground"], light["site-primary"]],
    ["dark accent on page", dark["site-accent-foreground"], dark["site-background"]],
    ["dark accent on panel", dark["site-accent-foreground"], dark["site-panel"]],
    ["dark muted text", dark["site-muted"], dark["site-background"]],
    ["dark text on primary", dark["site-primary-foreground"], dark["site-primary"]],
  ])("%s meets WCAG AA for normal text", (_name, foreground, background) => {
    expect(foreground).toBeDefined();
    expect(background).toBeDefined();
    expect(contrastRatio(foreground ?? "", background ?? "")).toBeGreaterThanOrEqual(4.5);
  });

  test("accent text, filled controls, and focus indicators use semantic roles", () => {
    expect(css).toMatch(/\.eyebrow,[\s\S]*?color:\s*var\(--site-accent-foreground\);/);
    expect(css).toMatch(
      /\.site-button\[data-primary="true"\][\s\S]*?color:\s*var\(--site-primary-foreground\);/,
    );
    expect(css).toContain("outline: 2px solid var(--site-accent-foreground);");
    expect(css).toContain("outline-offset: 3px;");
    expect(css).not.toContain("outline: none");
  });
});
