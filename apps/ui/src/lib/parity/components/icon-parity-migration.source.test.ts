import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import ButtonFixture from "./button.svelte";
import MenuFixture from "./menu.svelte";

const fixtureRoot = import.meta.dirname;
const packageRoot = resolve(fixtureRoot, "../../../../../../packages/ui/src");

const migratedFixtures = [
  "alert.svelte",
  "autocomplete.svelte",
  "badge.svelte",
  "button.svelte",
  "card.svelte",
  "collapsible.svelte",
  "combobox.svelte",
  "command.svelte",
  "context-menu.svelte",
  "drawer.svelte",
  "empty.svelte",
  "field.svelte",
  "group.svelte",
  "input-group.svelte",
  "menu.svelte",
  "number-field.svelte",
  "popover.svelte",
  "preview-card.svelte",
  "select.svelte",
  "slider.svelte",
  "tabs.svelte",
  "toast.svelte",
  "toggle-group.svelte",
  "toggle.svelte",
  "toolbar.svelte",
  "tooltip.svelte",
] as const;

function firstPath(
  icon: readonly (readonly [string, Readonly<Record<string, string | number>>])[],
) {
  return icon.find(([tag, attributes]) => tag === "path" && typeof attributes.d === "string")?.[1]
    .d;
}

describe("parity fixture icon migration", () => {
  it("enumerates every fixture and keeps copied SVG markup only for theme illustrations", () => {
    const fixtureNames = readdirSync(fixtureRoot)
      .filter((name) => name.endsWith(".svelte"))
      .sort();

    for (const fileName of fixtureNames) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      expect(source, fileName).not.toContain("@hugeicons/svelte");
      expect(source, fileName).not.toMatch(/lucide-/i);
      if (fileName === "radio-group.svelte") {
        expect(source.match(/<svg\b/g)).toHaveLength(3);
        expect(source.match(/viewBox="0 0 88 70"/g)).toHaveLength(3);
      } else {
        expect(source, fileName).not.toMatch(
          /<(?:svg|path|circle|ellipse|line|polyline|polygon)\b/i,
        );
      }
    }

    expect(migratedFixtures).toHaveLength(26);
    for (const fileName of migratedFixtures) {
      expect(fixtureNames).toContain(fileName);
      expect(readFileSync(resolve(fixtureRoot, fileName), "utf8"), fileName).toMatch(
        /(?:FixtureIcon|HugeiconsIcon)/,
      );
    }
  });

  it("routes the package Sidebar trigger through the SSR-safe renderer", () => {
    const source = readFileSync(
      resolve(packageRoot, "components/ui/sidebar/sidebar-trigger.svelte"),
      "utf8",
    );

    expect(source).toContain('import HugeiconsIcon from "$lib/hugeicons-icon.svelte"');
    expect(source).not.toContain("@hugeicons/svelte");
    expect(source).toContain("strokeWidth={2}");
  });

  it("keeps the canonical COSS semantic mappings", () => {
    const source = readFileSync(resolve(fixtureRoot, "fixture-icon.svelte"), "utf8");
    const mappings = [
      '"chevron-down": ChevronDownIcon',
      "currency: DollarSignIcon",
      "home: House01Icon",
      '"info-circle": InformationCircleIcon',
      "package: BoxIcon",
      "panels: PanelsTopLeftIcon",
      "redo: ArrowTurnBackwardIcon",
      "settings: Settings01Icon",
    ];

    for (const mapping of mappings) expect(source).toContain(mapping);
  });

  it("emits official Hugeicons geometry during SSR", () => {
    const buttonBody = render(ButtonFixture).body;
    const menuBody = render(MenuFixture).body;

    expect(buttonBody).toContain(`d="${firstPath(Add01Icon)}"`);
    expect(buttonBody).toContain(`d="${firstPath(Download01Icon)}"`);
    expect(buttonBody).toContain('viewBox="0 0 24 24"');
    expect(buttonBody).toContain('stroke-width="2"');
    expect(menuBody).not.toMatch(/<svg|<path/i);
  });
});
