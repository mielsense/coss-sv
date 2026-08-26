import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

type CssRule = {
  atRules: string[];
  declarations: CssDeclaration[];
  selectors: string[];
};

type CssDeclaration = {
  property: string;
  value: string;
};

type CascadeCandidate = {
  important: boolean;
  order: number;
  specificity: [ids: number, classes: number, elements: number];
  value: string;
};

type RoleContract = {
  expected: string;
  inheritedFrom?: string[];
  label: string;
  property: string;
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

function parseDeclarations(block: string): CssDeclaration[] {
  return block
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      if (separator < 1) throw new Error(`Invalid declaration: ${declaration}`);
      return {
        property: declaration.slice(0, separator).trim(),
        value: declaration.slice(separator + 1).trim(),
      };
    });
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

function selectorSpecificity(selector: string): CascadeCandidate["specificity"] {
  const ids = selector.match(/#[\w-]+/g)?.length ?? 0;
  const classes = selector.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g)?.length ?? 0;
  const elements =
    selector
      .replace(/#[\w-]+|\.[\w-]+|\[[^\]]+\]|::?[\w-]+/g, " ")
      .match(/(?:^|[\s>+~])([a-z][\w-]*)/gi)?.length ?? 0;

  return [ids, classes, elements];
}

function compareSpecificity(
  left: CascadeCandidate["specificity"],
  right: CascadeCandidate["specificity"],
): number {
  for (let index = 0; index < left.length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }

  return 0;
}

function compareCandidates(left: CascadeCandidate, right: CascadeCandidate): number {
  if (left.important !== right.important) return left.important ? 1 : -1;

  const specificity = compareSpecificity(left.specificity, right.specificity);
  return specificity !== 0 ? specificity : left.order - right.order;
}

function effectiveDeclaration(
  source: string,
  selectors: string[],
  property: string,
  atRule?: string,
): string | undefined {
  const candidates: CascadeCandidate[] = [];
  let order = 0;

  for (const rule of parseCssRules(source)) {
    if (atRule ? !rule.atRules.includes(atRule) : rule.atRules.length > 0) continue;

    for (const selector of selectors) {
      if (!rule.selectors.includes(selector)) continue;

      for (const declaration of rule.declarations) {
        order += 1;
        if (declaration.property !== property) continue;

        const important = /\s*!important\s*$/i.test(declaration.value);
        candidates.push({
          important,
          order,
          specificity: selectorSpecificity(selector),
          value: declaration.value.replace(/\s*!important\s*$/i, "").trim(),
        });
      }
    }
  }

  return candidates.sort(compareCandidates).at(-1)?.value;
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

  const properties = new Set(
    matchingRules.flatMap((rule) => rule.declarations.map(({ property }) => property)),
  );
  return new Map(
    [...properties].map((property) => {
      const value = effectiveDeclaration(source, [selector], property, atRule);
      if (!value) throw new Error(`Missing ${property} declaration for ${selector}`);
      return [property, value];
    }),
  );
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

const roleColorContracts: RoleContract[] = [
  {
    expected: "var(--site-muted)",
    label: ".site-nav",
    property: "color",
    selectors: [".site-nav"],
  },
  {
    expected: "var(--site-muted)",
    inheritedFrom: [".site-nav"],
    label: ".site-nav a",
    property: "color",
    selectors: ["a", ".site-nav a"],
  },
  {
    expected: "var(--site-muted)",
    label: ".hero-copy",
    property: "color",
    selectors: [".hero-copy"],
  },
  {
    expected: "var(--site-muted)",
    label: ".content-page p",
    property: "color",
    selectors: [".content-page p"],
  },
  {
    expected: "var(--site-muted)",
    label: ".content-page li",
    property: "color",
    selectors: [".content-page li"],
  },
  {
    expected: "var(--site-muted)",
    inheritedFrom: [".content-page p"],
    label: ".content-page a",
    property: "color",
    selectors: ["a", ".content-page a", ".content-page p a"],
  },
  {
    expected: "var(--site-muted)",
    inheritedFrom: [".content-page li"],
    label: ".content-page a",
    property: "color",
    selectors: ["a", ".content-page a", ".content-page li a"],
  },
  {
    expected: "var(--site-muted)",
    label: ".site-footer",
    property: "color",
    selectors: [".site-footer"],
  },
  {
    expected: "var(--site-muted)",
    inheritedFrom: [".site-footer"],
    label: ".site-footer a",
    property: "color",
    selectors: ["a", ".site-footer a"],
  },
  {
    expected: "var(--site-accent-foreground)",
    label: ".eyebrow",
    property: "color",
    selectors: [".eyebrow"],
  },
  {
    expected: "var(--site-accent-foreground)",
    label: ".content-page .eyebrow",
    property: "color",
    selectors: [".eyebrow", ".content-page p", ".content-page .eyebrow"],
  },
  {
    expected: "var(--site-accent-foreground)",
    label: ".hero-credit a",
    property: "color",
    selectors: ["a", ".hero-credit a"],
  },
  {
    expected: "var(--site-primary-foreground)",
    label: '.site-button[data-primary="true"]',
    property: "color",
    selectors: ["a", ".site-button", '.site-button[data-primary="true"]'],
  },
];

const focusTargets = [
  ".site-brand:focus-visible",
  ".site-nav a:focus-visible",
  ".site-footer a:focus-visible",
  ".hero-credit a:focus-visible",
  ".content-page a:focus-visible",
  ".site-button:focus-visible",
] as const;

const protectedProperties = new Set(["color", "outline", "outline-offset"]);

type ProtectedDeclarationGroup = {
  atRules?: string[];
  classification: "base theme" | "dark theme" | "focus treatment" | "semantic role" | "shiki";
  property: "color" | "outline" | "outline-offset";
  selectors: string[];
  value: string;
};

const protectedDeclarationGroups: ProtectedDeclarationGroup[] = [
  {
    classification: "base theme",
    selectors: ["html"],
    property: "color",
    value: "#171717",
  },
  {
    classification: "base theme",
    selectors: ["a"],
    property: "color",
    value: "inherit",
  },
  {
    classification: "semantic role",
    selectors: [".site-shell"],
    property: "color",
    value: "var(--site-foreground)",
  },
  {
    classification: "semantic role",
    selectors: [".site-nav", ".hero-copy", ".content-page p", ".content-page li", ".site-footer"],
    property: "color",
    value: "var(--site-muted)",
  },
  {
    classification: "semantic role",
    selectors: [".site-brand:hover", ".site-nav a:hover", ".site-footer a:hover"],
    property: "color",
    value: "var(--site-accent-foreground)",
  },
  {
    classification: "semantic role",
    selectors: [".eyebrow", ".content-page .eyebrow", ".hero-credit a"],
    property: "color",
    value: "var(--site-accent-foreground)",
  },
  {
    classification: "semantic role",
    selectors: ['.site-button[data-primary="true"]'],
    property: "color",
    value: "var(--site-primary-foreground)",
  },
  {
    classification: "focus treatment",
    selectors: [...focusTargets],
    property: "outline",
    value: "2px solid var(--site-accent-foreground)",
  },
  {
    classification: "focus treatment",
    selectors: [...focusTargets],
    property: "outline-offset",
    value: "3px",
  },
  {
    classification: "shiki",
    selectors: [".shiki", ".shiki span"],
    property: "color",
    value: "var(--shiki-light)",
  },
  {
    atRules: [darkMedia],
    classification: "dark theme",
    selectors: ["html"],
    property: "color",
    value: "#f5f5f5",
  },
  {
    atRules: [darkMedia],
    classification: "dark theme",
    selectors: [".site-shell"],
    property: "color",
    value: "var(--site-foreground)",
  },
  {
    atRules: [darkMedia],
    classification: "shiki",
    selectors: [".shiki", ".shiki span"],
    property: "color",
    value: "var(--shiki-dark)",
  },
];

function protectedDeclarationKey(
  atRules: string[],
  selector: string,
  property: string,
  value: string,
): string {
  return JSON.stringify([atRules, selector, property, value]);
}

const allowedProtectedDeclarations = new Map(
  protectedDeclarationGroups.flatMap((group) =>
    group.selectors.map((selector) => [
      protectedDeclarationKey(group.atRules ?? [], selector, group.property, group.value),
      group.classification,
    ]),
  ),
);

function assertProtectedDeclarationAudit(source: string): void {
  const seen = new Set<string>();

  for (const rule of parseCssRules(source)) {
    for (const declaration of rule.declarations) {
      if (!protectedProperties.has(declaration.property)) continue;

      for (const selector of rule.selectors) {
        const identity = protectedDeclarationKey(rule.atRules, selector, declaration.property, "");
        if (seen.has(identity)) {
          throw new Error(
            `Duplicate protected declaration for ${selector} ${declaration.property}${
              rule.atRules.length > 0 ? ` in ${rule.atRules.join(" in ")}` : ""
            }`,
          );
        }
        seen.add(identity);

        const key = protectedDeclarationKey(
          rule.atRules,
          selector,
          declaration.property,
          declaration.value,
        );
        if (!allowedProtectedDeclarations.has(key)) {
          throw new Error(
            `Unclassified protected declaration: ${selector} { ${declaration.property}: ${declaration.value} }${
              rule.atRules.length > 0 ? ` in ${rule.atRules.join(" in ")}` : ""
            }`,
          );
        }
      }
    }
  }
}

function effectiveRoleDeclaration(source: string, contract: RoleContract): string {
  const direct = effectiveDeclaration(source, contract.selectors, contract.property);
  if (direct && direct !== "inherit") return direct;

  for (const inheritedSelector of contract.inheritedFrom ?? []) {
    const inherited = effectiveDeclaration(source, [inheritedSelector], contract.property);
    if (inherited && inherited !== "inherit") return inherited;
  }

  throw new Error(`Missing ${contract.property} declaration for ${contract.label}`);
}

function assertRoleColorContracts(source: string): void {
  for (const contract of roleColorContracts) {
    const actual = effectiveRoleDeclaration(source, contract);
    if (actual !== contract.expected) {
      throw new Error(
        `Expected ${contract.label} ${contract.property} to be ${contract.expected}, received ${actual}`,
      );
    }
  }

  for (const selector of focusTargets) {
    for (const [property, expected] of [
      ["outline", "2px solid var(--site-accent-foreground)"],
      ["outline-offset", "3px"],
    ] as const) {
      const actual = effectiveDeclaration(source, [selector], property);
      if (!actual) throw new Error(`Missing ${selector} ${property} declaration`);
      if (actual !== expected) {
        throw new Error(`Expected ${selector} ${property} to be ${expected}, received ${actual}`);
      }
    }
  }

  assertProtectedDeclarationAudit(source);
}

describe("CSS contract parser", () => {
  test("reads declarations from grouped selectors without crossing rule boundaries", () => {
    expect(requiredDeclaration(css, ".content-page li", "color")).toBe("var(--site-muted)");
    expect(requiredDeclaration(css, ".content-page .eyebrow", "color")).toBe(
      "var(--site-accent-foreground)",
    );
  });

  test("resolves source order, specificity, and important priority", () => {
    expect(
      effectiveDeclaration(
        ".scope a { color: #111111; } .scope a { color: #222222; }",
        [".scope a"],
        "color",
      ),
    ).toBe("#222222");
    expect(
      effectiveDeclaration(
        "a { color: #111111; } .scope a { color: #222222; }",
        ["a", ".scope a"],
        "color",
      ),
    ).toBe("#222222");
    expect(
      effectiveDeclaration(
        ".scope a { color: #111111 !important; } .scope a { color: #222222; }",
        [".scope a"],
        "color",
      ),
    ).toBe("#111111");
  });

  test("keeps duplicate declarations ordered before applying important priority", () => {
    expect(
      effectiveDeclaration(
        ".scope a { color: #111111 !important; color: #222222; }",
        [".scope a"],
        "color",
      ),
    ).toBe("#111111");
  });

  test("classifies every protected declaration in the foundation stylesheet", () => {
    expect(() => assertProtectedDeclarationAudit(css)).not.toThrow();
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

  test("rejects a later navigation-link color override", () => {
    const mutated = `${css}\n.site-nav a { color: #ffffff; }\n`;
    expect(() => assertRoleColorContracts(mutated)).toThrow(/site-nav a color/);
  });

  test("rejects a later content-link color override", () => {
    const mutated = `${css}\n.content-page a { color: #ffffff; }\n`;
    expect(() => assertRoleColorContracts(mutated)).toThrow(/content-page a color/);
  });

  test("rejects removing the button from the shared focus rule", () => {
    const mutated = css.replace(",\n.site-button:focus-visible {", " {");
    expect(mutated).not.toBe(css);
    expect(() => assertRoleColorContracts(mutated)).toThrow(/site-button:focus-visible outline/);
  });

  test("rejects a later focus rule that removes the button outline", () => {
    const mutated = `${css}\n.site-button:focus-visible { outline: none; }\n`;
    expect(() => assertRoleColorContracts(mutated)).toThrow(/site-button:focus-visible outline/);
  });

  test.each([
    ["arbitrary selector", ".unreviewed-copy { color: #ffffff; }"],
    ["more-specific navigation ancestor", ".site-shell .site-nav a { color: #ffffff; }"],
    [
      "more-specific important navigation ancestor",
      "body .site-nav a { color: #ffffff !important; }",
    ],
    ["more-specific content ancestor", ".site-shell .content-page a { color: #ffffff; }"],
    [
      "more-specific important content ancestor",
      "body .content-page a { color: #ffffff !important; }",
    ],
    [
      "more-specific primary control ancestor",
      '.site-shell .site-button[data-primary="true"] { color: #ffffff; }',
    ],
    [
      "more-specific important primary control ancestor",
      'body .site-button[data-primary="true"] { color: #ffffff !important; }',
    ],
    ["more-specific focus ancestor", ".site-shell .site-button:focus-visible { outline: none; }"],
    [
      "more-specific important focus ancestor",
      "body .site-button:focus-visible { outline: none !important; }",
    ],
  ])("rejects an unclassified %s protected override", (_label, override) => {
    const mutated = `${css}\n${override}\n`;
    expect(() => assertProtectedDeclarationAudit(mutated)).toThrow(
      /Unclassified protected declaration/,
    );
  });

  test("audits protected overrides inside responsive at-rules", () => {
    const mutated = `${css}\n@media (max-width: 36rem) { .site-nav a { color: #ffffff; } }\n`;
    expect(() => assertProtectedDeclarationAudit(mutated)).toThrow(
      /Unclassified protected declaration.*@media \(max-width: 36rem\)/,
    );
  });

  test("audits every selector in a grouped protected rule", () => {
    const mutated = css.replace(
      ".site-brand:focus-visible,",
      ".unreviewed-focus:focus-visible,\n.site-brand:focus-visible,",
    );
    expect(mutated).not.toBe(css);
    expect(() => assertProtectedDeclarationAudit(mutated)).toThrow(
      /Unclassified protected declaration: \.unreviewed-focus:focus-visible/,
    );
  });

  test.each([
    [
      "color",
      "  color: var(--site-muted);",
      "  color: #ffffff !important;\n  color: var(--site-muted);",
    ],
    [
      "outline",
      "  outline: 2px solid var(--site-accent-foreground);",
      "  outline: none !important;\n  outline: 2px solid var(--site-accent-foreground);",
    ],
  ])(
    "rejects duplicate protected %s declarations without collapsing them",
    (_property, from, to) => {
      const mutated = css.replace(from, to);
      expect(mutated).not.toBe(css);
      expect(() => assertProtectedDeclarationAudit(mutated)).toThrow(
        /(?:Unclassified|Duplicate) protected declaration/,
      );
    },
  );
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
