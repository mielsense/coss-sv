import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

function readParityFixture(name: "dialog" | "drawer" | "sheet"): string {
  return readFileSync(
    new URL(`../../../../../../apps/ui/src/lib/parity/components/${name}.svelte`, import.meta.url),
    "utf8",
  );
}

describe("overlay parity form lifecycle", () => {
  test.each([
    ["dialog", 6],
    ["sheet", 2],
  ] as const)("initializes every %s Input binding inside remounted state", (name, count) => {
    const source = readParityFixture(name);
    expect(source.match(/<Input\b[^>]*\bbind:value=/gs)).toHaveLength(count);
    expect(source).not.toMatch(/<Input[^>]*defaultValue=/);
  });

  test("keeps all Drawer bindings and the exact nested member defaults", () => {
    const source = readParityFixture("drawer");
    expect(source.match(/<Input\b[^>]*\bbind:value=/gs)).toHaveLength(8);
    expect(source.match(/<Input\b[^>]*\bdefaultValue=/gs)).toHaveLength(2);
    expect(source).toContain('defaultValue="Bora Baloglu"');
    expect(source).toContain('defaultValue="bora@example.com"');
  });

  test("places every Dialog form binding inside its remounted Popup fragment", () => {
    const source = readParityFixture("dialog");
    for (const marker of [
      '{const firstProfile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}',
      '{const member = $state({ email: "bora@example.com", name: "Bora Baloglu" })}',
      '{const bareProfile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}',
    ]) {
      expect(source).toContain(marker);
    }
  });

  test("places every Sheet and Drawer form binding inside its remounted Popup fragment", () => {
    const sheet = readParityFixture("sheet");
    expect(sheet).toContain(
      '{const profile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}',
    );
    expect(sheet).toContain('const variants = ["default", "inset"] as const;');

    const drawer = readParityFixture("drawer");
    for (const marker of [
      '{const nestedMember = $state({ email: "bora@example.com", name: "Bora Baloglu" })}',
      '{const profile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}',
      "{const responsiveDrawer = $state({",
      "{const responsiveDialog = $state({",
    ]) {
      expect(drawer).toContain(marker);
    }
    expect(drawer).toContain('const footerVariants = ["default", "bare"] as const;');
    expect(drawer).toContain("{#each footerVariants as footerVariant}");
  });
});
