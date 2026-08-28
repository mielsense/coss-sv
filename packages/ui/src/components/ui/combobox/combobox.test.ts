import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Combobox from "./index.js";
import Fixture from "./combobox.ssr-fixture.svelte";
describe("Combobox SSR and export contract", () => {
  test("renders the COSS input composition and slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('role="combobox"');
    expect(body).toContain('data-slot="combobox-input"');
    expect(body).toContain('data-slot="combobox-trigger"');
    expect(body).toContain('data-slot="combobox-clear"');
    expect(body).toContain('aria-label="Clear fruit"');
    expect(body).toContain('data-testid="composed-clear"');
    const composedClear = body.match(
      /<button[^>]*data-testid="composed-clear"[^>]*>(.*?)<\/button>/s,
    );
    expect(composedClear?.[1]).toContain("<svg");
    const bareClear = body.match(/<button[^>]*data-testid="bare-clear"[^>]*>(.*?)<\/button>/s);
    expect(bareClear).not.toBeNull();
    expect(bareClear?.[0]).not.toContain("aria-label");
    expect(bareClear?.[1]?.replace(/<!--.*?-->/gs, "")).toBe("");
  });
  test("exports the compound and long-form API", () => {
    expect(Combobox.Combobox).toBe(Combobox.Root);
    expect(Combobox.ComboboxInput).toBe(Combobox.Input);
    expect(Combobox.ComboboxPrimitive).toBeTypeOf("object");
    expect(Combobox.useComboboxFilter).toBe(Combobox.createFilter);
  });
});
