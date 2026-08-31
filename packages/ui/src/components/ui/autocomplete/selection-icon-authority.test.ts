import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(import.meta.dirname, "..");

const iconContracts = {
  "autocomplete/autocomplete-clear.svelte": ["Cancel01Icon"],
  "autocomplete/autocomplete-input.svelte": ["UnfoldMoreIcon"],
  "combobox/combobox-chip-remove.svelte": ["Cancel01Icon"],
  "combobox/combobox-input.svelte": ["Cancel01Icon", "UnfoldMoreIcon"],
  "combobox/combobox-item.svelte": ["Tick02Icon"],
  "command/command-input.svelte": ["Search01Icon"],
  "select/select-button.svelte": ["UnfoldMoreIcon"],
  "select/select-item.svelte": ["Tick02Icon"],
  "select/select-popup.svelte": ["ChevronDownIcon", "ChevronUpIcon"],
  "select/select-trigger.svelte": ["UnfoldMoreIcon"],
} as const;

describe("selection component icon authority", () => {
  it("uses the shared SSR-safe Hugeicons renderer for every C13 UI icon", () => {
    for (const [relativePath, icons] of Object.entries(iconContracts)) {
      const source = readFileSync(resolve(sourceRoot, relativePath), "utf8");

      expect(source, relativePath).toContain('import HugeiconsIcon from "@/hugeicons-icon.svelte"');
      expect(source, relativePath).toContain('from "@hugeicons/core-free-icons/');
      expect(source, relativePath).not.toMatch(
        /@hugeicons\/svelte|lucide(?:-react|-svelte)?|<svg\b|<path\b/i,
      );
      expect(source, relativePath).toContain("strokeWidth={2}");

      for (const icon of icons) {
        expect(source, `${relativePath}: ${icon}`).toContain(icon);
      }
    }
  });
});
