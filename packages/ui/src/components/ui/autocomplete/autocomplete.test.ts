import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Autocomplete from "./index.js";
import Fixture from "./autocomplete.ssr-fixture.svelte";

describe("Autocomplete SSR and export contract", () => {
  test("renders the COSS input composition and slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('role="combobox"');
    expect(body).toContain('data-slot="autocomplete-input-group"');
    expect(body).toContain('data-slot="autocomplete-input"');
    expect(body).toContain('data-slot="autocomplete-trigger"');
    expect(body).toContain('data-slot="autocomplete-clear"');
  });

  test("exports the compound and long-form API", () => {
    expect(Autocomplete.Autocomplete).toBe(Autocomplete.Root);
    expect(Autocomplete.AutocompleteInput).toBe(Autocomplete.Input);
    expect(Autocomplete.AutocompletePrimitive).toBeTypeOf("object");
    expect(Autocomplete.useAutocompleteFilter).toBe(Autocomplete.createFilter);
  });
});
