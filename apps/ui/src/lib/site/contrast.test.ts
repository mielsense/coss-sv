import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

type CssRule = {
  atRules: string[];
  declarations: Map<string, string>;
  selectors: string[];
};

type Rgb = [red: number, green: number, blue: number];

const css = await readFile(new URL("../../app.css", import.meta.url), "utf8");
const darkMedia = "@media (prefers-color-scheme: dark)";
const measuredMobileNavBackground = "#faf2f0";
const gradientTextContrastTarget = 4.7;

function closingBrace(source: string, openingBrace: number): number {
  let depth = 1;

  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return index;
  }

  throw new Error(`Missing closing brace after character ${openingBrace}`);
}

function parseDeclarations(block: string): Map<string, string> {
  return new Map(
    block
      .split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const separator = declaration.indexOf(":");
        if (separator < 1) throw new Error(`Invalid declaration: ${declaration}`);
        return [declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim()];
      }),
  );
}

function parseCssRules(source: string, atRules: string[] = []): CssRule[] {
  const rules: CssRule[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const openingBrace = source.indexOf("{", cursor);
    if (openingBrace === -1) break;

    const header = source.slice(cursor, openingBrace).trim();
    const end = closingBrace(source, openingBrace);
    const block = source.slice(openingBrace + 1, end);

    if (header.startsWith("@")) {
      rules.push(...parseCssRules(block, [...atRules, header]));
    } else {
      rules.push({
        atRules,
        declarations: parseDeclarations(block),
        selectors: header.split(",").map((selector) => selector.trim()),
      });
    }

    cursor = end + 1;
  }

  return rules;
}

function declarationsFor(source: string, selector: string, atRule?: string): Map<string, string> {
  const matchingRules = parseCssRules(source).filter(
    (candidate) =>
      candidate.selectors.includes(selector) &&
      (atRule ? candidate.atRules.includes(atRule) : candidate.atRules.length === 0),
  );

  if (matchingRules.length === 0) {
    throw new Error(`Missing rule for ${selector}${atRule ? ` in ${atRule}` : ""}`);
  }

  return new Map(matchingRules.flatMap((rule) => [...rule.declarations]));
}

function requiredDeclaration(
  source: string,
  selector: string,
  property: string,
  atRule?: string,
): string {
  const value = declarationsFor(source, selector, atRule).get(property);
  if (!value) throw new Error(`Missing ${property} declaration for ${selector}`);
  return value;
}

function tokensFor(source: string, atRule?: string): Record<string, string> {
  return Object.fromEntries(
    [...declarationsFor(source, ".site-shell", atRule)].filter(([property]) =>
      property.startsWith("--"),
    ),
  );
}

function requiredToken(tokens: Record<string, string>, name: string): string {
  const value = tokens[name];
  if (!value) throw new Error(`Missing ${name} token`);
  return value;
}

function parseHex(hex: string): Rgb {
  if (!/^#[\da-f]{6}$/i.test(hex)) {
    throw new Error(`Expected a six-digit hex color, received ${hex}`);
  }

  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)) as Rgb;
}

function relativeLuminance([red, green, blue]: Rgb): number {
  const linear = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  }) as Rgb;

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function composite(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return foreground.map((channel, index) =>
    Math.round(channel * alpha + (background[index] ?? 0) * (1 - alpha)),
  ) as Rgb;
}

const roleColorContracts = [
  [".site-nav", "color", "var(--site-muted)"],
  [".hero-copy", "color", "var(--site-muted)"],
  [".content-page p", "color", "var(--site-muted)"],
  [".content-page li", "color", "var(--site-muted)"],
  [".site-footer", "color", "var(--site-muted)"],
  [".eyebrow", "color", "var(--site-accent-foreground)"],
  [".content-page .eyebrow", "color", "var(--site-accent-foreground)"],
  [".hero-credit a", "color", "var(--site-accent-foreground)"],
  ['.site-button[data-primary="true"]', "color", "var(--site-primary-foreground)"],
] as const;

function assertRoleColorContracts(source: string): void {
  for (const [selector, property, expected] of roleColorContracts) {
    const actual = requiredDeclaration(source, selector, property);
    if (actual !== expected) {
      throw new Error(`Expected ${selector} ${property} to be ${expected}, received ${actual}`);
    }
  }
}

describe("CSS contract parser", () => {
  test("reads declarations from grouped selectors without crossing rule boundaries", () => {
    expect(requiredDeclaration(css, ".content-page li", "color")).toBe("var(--site-muted)");
    expect(requiredDeclaration(css, ".content-page .eyebrow", "color")).toBe(
      "var(--site-accent-foreground)",
    );
  });

  test("rejects a removed role declaration", () => {
    const mutated = css.replace("  color: var(--site-muted);", "");
    expect(mutated).not.toBe(css);
    expect(() => assertRoleColorContracts(mutated)).toThrow(
      /Missing color declaration for .site-nav/,
    );
  });

  test("rejects a role assigned to the wrong semantic color", () => {
    const mutated = css.replace(
      ".hero-credit a {\n  color: var(--site-accent-foreground);",
      ".hero-credit a {\n  color: var(--site-muted);",
    );
    expect(mutated).not.toBe(css);
    expect(() => assertRoleColorContracts(mutated)).toThrow(/Expected .hero-credit a color/);
  });
});

describe("documentation color contrast", () => {
  const light = tokensFor(css);
  const dark = { ...light, ...tokensFor(css, darkMedia) };

  test("keeps Svelte orange as the primary brand color", () => {
    expect(light["--site-primary"]).toBe("#ff3e00");
    expect(dark["--site-primary"]).toBe("#ff3e00");
  });

  test.each([
    ["light accent on page", light["--site-accent-foreground"], light["--site-background"]],
    ["light accent on panel", light["--site-accent-foreground"], light["--site-panel"]],
    ["light text on primary", light["--site-primary-foreground"], light["--site-primary"]],
    ["dark accent on page", dark["--site-accent-foreground"], dark["--site-background"]],
    ["dark accent on panel", dark["--site-accent-foreground"], dark["--site-panel"]],
    ["dark muted text", dark["--site-muted"], dark["--site-background"]],
    ["dark text on primary", dark["--site-primary-foreground"], dark["--site-primary"]],
  ])("%s meets WCAG AA for normal text", (_name, foreground, background) => {
    expect(
      contrastRatio(parseHex(foreground ?? ""), parseHex(background ?? "")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  test("muted text clears the measured worst rendered mobile gradient with margin", () => {
    expect(
      contrastRatio(
        parseHex(requiredToken(light, "--site-muted")),
        parseHex(measuredMobileNavBackground),
      ),
    ).toBeGreaterThanOrEqual(gradientTextContrastTarget);
  });

  test("muted text clears the maximum declared gradient composite with margin", () => {
    const background = requiredDeclaration(css, ".site-shell", "background");
    const percentage =
      /color-mix\(in srgb,\s*var\(--site-primary\)\s+([\d.]+)%,\s*transparent\)/.exec(
        background,
      )?.[1];
    if (!percentage) throw new Error("Missing primary gradient percentage");

    const maximumGradient = composite(
      parseHex(requiredToken(light, "--site-primary")),
      parseHex(requiredToken(light, "--site-background")),
      Number(percentage) / 100,
    );

    expect(
      contrastRatio(parseHex(requiredToken(light, "--site-muted")), maximumGradient),
    ).toBeGreaterThanOrEqual(gradientTextContrastTarget);
  });

  test("semantic roles use their required color declarations", () => {
    expect(() => assertRoleColorContracts(css)).not.toThrow();
    expect(requiredDeclaration(css, '.site-button[data-primary="true"]', "background")).toBe(
      "var(--site-primary)",
    );
    expect(requiredDeclaration(css, ".site-nav a:focus-visible", "outline")).toBe(
      "2px solid var(--site-accent-foreground)",
    );
    expect(requiredDeclaration(css, ".site-nav a:focus-visible", "outline-offset")).toBe("3px");
  });
});
