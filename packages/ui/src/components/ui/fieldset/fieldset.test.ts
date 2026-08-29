import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import FieldsetAssociationSsrFixture from "./fieldset-association.ssr-fixture.svelte";
import FieldsetSsrFixture from "./fieldset.ssr-fixture.svelte";
import * as Fieldset from "./index.js";

describe("Fieldset SSR contract", () => {
  test("renders semantic legend labelling and disabled propagation", () => {
    const { body } = render(FieldsetSsrFixture);

    expect(body).toContain("<fieldset");
    expect(body).toContain('data-slot="fieldset"');
    expect(body).toContain(" disabled");
    expect(body).toContain('id="preferences-legend" data-disabled=""');
    const outerRoot = body.match(/<fieldset[^>]*data-slot="fieldset"[^>]*>/)?.[0];
    expect(outerRoot).toContain('aria-labelledby="preferences-legend"');
    const nestedRoot = body.match(/<fieldset[^>]*data-testid="nested-fieldset"[^>]*>/)?.[0];
    expect(nestedRoot).toContain('data-disabled=""');
    expect(nestedRoot).toContain('disabled=""');
    const nestedLegend = body.match(/<div[^>]*data-testid="nested-legend"[^>]*>/)?.[0];
    const nestedLegendId = nestedLegend?.match(/id="([^"]+)"/)?.[1];
    expect(nestedLegendId).toBeTruthy();
    expect(nestedRoot).toContain(`aria-labelledby="${nestedLegendId}"`);
    expect(nestedLegend).toContain('data-disabled=""');
    expect(body).toContain('data-testid="nested-legend-state">true</span>');
    expect(body).toContain("font-semibold text-foreground");
  });

  test("exports namespace parts and compatibility aliases", () => {
    expect(Fieldset.Root).toBeTypeOf("function");
    expect(Fieldset.Legend).toBeTypeOf("function");
    expect(Fieldset.Fieldset).toBe(Fieldset.Root);
    expect(Fieldset.FieldsetLegend).toBe(Fieldset.Legend);
  });

  test("omits dangling server associations without an explicit root legend id", () => {
    const body = render(FieldsetAssociationSsrFixture).body;
    const withoutLegend = body.match(
      /<fieldset[^>]*data-testid="fieldset-without-legend"[^>]*>/,
    )?.[0];
    const withCustomLegend = body.match(
      /<fieldset[^>]*data-testid="fieldset-with-custom-legend"[^>]*>/,
    )?.[0];
    const customLegend = body.match(/<div[^>]*data-testid="custom-fieldset-legend"[^>]*>/)?.[0];

    expect(withoutLegend).not.toContain("aria-labelledby");
    expect(withCustomLegend).not.toContain("aria-labelledby");
    expect(customLegend).toContain('id="custom-fieldset-legend"');
  });
});
