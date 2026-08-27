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
  });
  test("exports the compound and long-form API", () => {
    expect(Combobox.Combobox).toBe(Combobox.Root);
    expect(Combobox.ComboboxInput).toBe(Combobox.Input);
    expect(Combobox.ComboboxPrimitive).toBeTypeOf("object");
    expect(Combobox.useComboboxFilter).toBe(Combobox.createFilter);
  });
});
