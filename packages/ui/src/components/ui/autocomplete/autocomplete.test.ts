import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import Fixture from "./autocomplete.ssr-fixture.svelte";
import * as Autocomplete from "./index.js";

describe("Autocomplete SSR and export contract", () => {
  test("renders the COSS input composition and slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('role="combobox"');
    expect(body).toContain('data-slot="autocomplete-input-group"');
    expect(body).toContain('data-slot="autocomplete-input"');
    expect(body).toContain('data-slot="autocomplete-trigger"');
    expect(body).toContain('data-slot="autocomplete-clear"');
  });

  test("keeps addon and end-adornment selectors on the input control", () => {
    const { body } = render(Fixture);
    const control = body.match(/<span[^>]*data-slot="input-control"[^>]*>/)?.[0] ?? "";
    const input = body.match(/<input[^>]*data-slot="autocomplete-input"[^>]*>/)?.[0] ?? "";

    expect(control).toContain('data-size="sm"');
    expect(control).toContain(
      "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)]",
    );
    expect(control).toContain(
      "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5",
    );
    expect(input).not.toContain("data-size=");
    expect(input).not.toContain("*:data-[slot=autocomplete-input]");
  });

  test("does not invent content for a bare public trigger", () => {
    const { body } = render(Fixture);
    const trigger = body.match(
      /<button[^>]*data-testid="bare-autocomplete-trigger"[^>]*>(.*?)<\/button>/s,
    );
    expect(trigger).not.toBeNull();
    expect(trigger?.[1]?.replace(/<!--.*?-->/gs, "")).toBe("");
  });

  test("exports the compound and long-form API", () => {
    expect(Autocomplete.Autocomplete).toBe(Autocomplete.Root);
    expect(Autocomplete.AutocompleteInput).toBe(Autocomplete.Input);
    expect(Autocomplete.AutocompletePrimitive).toBeTypeOf("object");
    expect(Autocomplete.useAutocompleteFilter).toBe(Autocomplete.createFilter);
  });
});
