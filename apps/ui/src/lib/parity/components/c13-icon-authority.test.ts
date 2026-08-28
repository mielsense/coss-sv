import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const fixtureRoot = import.meta.dirname;

const iconContracts = {
  "autocomplete.svelte": ["MapPinIcon", "Search01Icon"],
  "combobox.svelte": ["Cancel01Icon", "Search01Icon", "UnfoldMoreIcon"],
  "command.svelte": [
    "ArrowDown02Icon",
    "ArrowLeft02Icon",
    "ArrowUp02Icon",
    "CircleQuestionMarkIcon",
    "CornerDownLeftIcon",
    "Search01Icon",
    "SparklesIcon",
  ],
  "select.svelte": ["CableIcon", "CodeXmlIcon", "GlobeIcon", "LayersIcon", "ZapIcon"],
} as const;

const representativeGlyphs = {
  "combobox.svelte": [">×</Button"],
  "command.svelte": [">✦</span>", ">⌕</EmptyMedia>", ">← Back to search", ">?</span>"],
  "select.svelte": ['icon: "▦"', 'icon: "ϟ"', 'icon: "◎"', 'icon: "</>"', ">⌁</span>"],
} as const;

describe("C13 parity fixture icon authority", () => {
  it("uses the matching Hugeicons assets instead of representative glyphs", () => {
    for (const [fileName, icons] of Object.entries(iconContracts)) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");

      expect(source, fileName).toContain('from "@hugeicons/svelte"');
      expect(source, fileName).toContain('from "@hugeicons/core-free-icons"');
      expect(source, fileName).not.toMatch(/<svg|<path|lucide/i);

      for (const icon of icons) {
        expect(source, `${fileName}: ${icon}`).toContain(icon);
      }

      for (const glyph of representativeGlyphs[fileName as keyof typeof representativeGlyphs] ??
        []) {
        expect(source, `${fileName}: ${glyph}`).not.toContain(glyph);
      }
    }
  });
});
