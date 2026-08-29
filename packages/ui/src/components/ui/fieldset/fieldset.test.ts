import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
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
});
