import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const sourceRoot = resolve(import.meta.dirname, "..");
const migratedSources = [
  "breadcrumb/breadcrumb-ellipsis.svelte",
  "breadcrumb/breadcrumb-separator.svelte",
  "checkbox/checkbox.svelte",
  "context-menu/context-menu-checkbox-item.svelte",
  "context-menu/context-menu-radio-item.svelte",
  "context-menu/context-menu-sub-trigger.svelte",
  "dialog/dialog-popup.svelte",
  "drawer/drawer-menu-checkbox-item.svelte",
  "drawer/drawer-menu-radio-item.svelte",
  "drawer/drawer-menu-trigger.svelte",
  "drawer/drawer-popup.svelte",
  "menu/menu-checkbox-item.svelte",
  "menu/menu-radio-item.svelte",
  "menu/menu-sub-trigger.svelte",
  "number-field/cursor-grow-icon.svelte",
  "number-field/number-field-step-button.svelte",
  "pagination/pagination-ellipsis.svelte",
  "pagination/pagination-next.svelte",
  "pagination/pagination-previous.svelte",
  "sheet/sheet-popup.svelte",
  "spinner/spinner.svelte",
  "toast/toast-icon.svelte",
] as const;

describe("package icon authority", () => {
  test.each(migratedSources)("%s delegates real UI icons to Hugeicons", (relativePath) => {
    const source = readFileSync(resolve(sourceRoot, relativePath), "utf8");

    expect(source).toContain("@hugeicons/core-free-icons");
    expect(source).toContain("@/hugeicons-icon.svelte");
    expect(source).toContain("<HugeiconsIcon");
    if (relativePath === "spinner/spinner.svelte") {
      expect(source).toContain("strokeWidth={Number(computedStrokeWidth)}");
    } else if (relativePath === "checkbox/checkbox.svelte") {
      expect(source).toContain("strokeWidth={3}");
    } else {
      expect(source).toContain("strokeWidth={2}");
    }
    expect(source).not.toMatch(/<svg\b|<path\b|<circle\b|<line\b/i);
    expect(source).not.toMatch(/lucide/i);
  });

  test("keeps all hardcoded SVG glyph data inside the typed adapter", () => {
    for (const relativePath of migratedSources) {
      const source = readFileSync(resolve(sourceRoot, relativePath), "utf8");
      expect(source).not.toMatch(/\bd=(?:"|'|\{)/);
    }
  });

  test("renders only explicit Hugeicons node tags without embedded glyph data", () => {
    const source = readFileSync(resolve(sourceRoot, "../../lib/hugeicons-icon.svelte"), "utf8");

    expect(source).toContain('type SafeNodeTag = "circle" | "ellipse" | "path" | "rect"');
    expect(source).not.toContain("{@html");
    expect(source).not.toMatch(/\bd=(?:"|'|\{)/);
    expect(source).not.toContain("@hugeicons/svelte");
  });
});
