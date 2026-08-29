import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import FieldSsrFixture from "./field.ssr-fixture.svelte";
import FieldControlRelationshipsSsrFixture from "./field-control-relationships.ssr-fixture.svelte";
import FieldExplicitControlsSsrFixture from "./field-explicit-controls.ssr-fixture.svelte";
import FieldFieldsetAssociationSsrFixture from "./field-fieldset-association.ssr-fixture.svelte";
import FieldFieldsetSsrFixture from "./field-fieldset.ssr-fixture.svelte";
import FieldGeneratedFieldsetSsrFixture from "./field-generated-fieldset.ssr-fixture.svelte";
import FieldLabelPolymorphismSsrFixture from "./field-label-polymorphism.ssr-fixture.svelte";
import * as Field from "./index.js";
import { FieldRelationshipState } from "./relationship-context.svelte.js";

describe("Field SSR contract", () => {
  test("renders the exact styled parts and explicit relationships", () => {
    const { body } = render(FieldSsrFixture);

    expect(body).toContain('data-slot="field"');
    expect(body).toContain("flex flex-col items-start gap-2");
    expect(body).toContain('id="account-name"');
    expect(body).toContain('for="account-name"');
    expect(body).toContain('aria-describedby="account-help account-error"');
    expect(body).toContain('aria-invalid="true"');
    expect(body).toContain('data-slot="field-item"');
    expect(body).toContain("text-destructive-foreground text-xs");
  });

  test("exports the namespace parts, compatibility aliases, and primitive", () => {
    expect(Field.Root).toBeTypeOf("function");
    expect(Field.Label).toBeTypeOf("function");
    expect(Field.Item).toBeTypeOf("function");
    expect(Field.Description).toBeTypeOf("function");
    expect(Field.Error).toBeTypeOf("function");
    expect(Field.Control).toBeTypeOf("function");
    expect(Field.Validity).toBeTypeOf("function");
    expect(Field.Field).toBe(Field.Root);
    expect(Field.FieldLabel).toBe(Field.Label);
    expect(Field.FieldPrimitive.Root).toBeTypeOf("function");
  });

  test("composes Field and Fieldset contexts on one fieldset root", () => {
    const { body } = render(FieldFieldsetSsrFixture);

    expect(body.match(/<fieldset/g)).toHaveLength(1);
    expect(body).not.toContain('<div data-slot="field"');
    expect(body).toContain('data-slot="field"');
    expect(body).toContain("flex flex-col items-start gap-4");
    expect(body).toContain('data-slot="fieldset-legend"');
    expect(body).toContain('id="frameworks-legend"');
    expect(body).toMatch(/<fieldset[^>]*aria-labelledby="frameworks-legend"/);
    expect(body).toMatch(/<fieldset[^>]* disabled(?:="")?/);
    expect(body).toContain("data-disabled");
  });

  test("server-renders a hydration-stable generated legend relationship in fieldset mode", () => {
    const body = render(FieldGeneratedFieldsetSsrFixture).body;
    const fieldset = body.match(/<fieldset[^>]*data-testid="generated-fieldset"[^>]*>/)?.[0];
    const legend = body.match(/<div[^>]*data-testid="generated-legend"[^>]*>/)?.[0];
    const legendId = legend?.match(/id="([^"]+)"/)?.[1];

    expect(legendId).toBeTruthy();
    expect(fieldset).toContain(`aria-labelledby="${legendId}"`);
    expect(body.match(/<fieldset/g)).toHaveLength(1);
  });

  test("omits dangling fieldset associations without an explicit root legend id", () => {
    const body = render(FieldFieldsetAssociationSsrFixture).body;
    const withoutLegend = body.match(/<fieldset[^>]*data-testid="field-without-legend"[^>]*>/)?.[0];
    const withCustomLegend = body.match(
      /<fieldset[^>]*data-testid="field-with-custom-legend"[^>]*>/,
    )?.[0];
    const customLegend = body.match(/<div[^>]*data-testid="custom-field-legend"[^>]*>/)?.[0];

    expect(withoutLegend).not.toContain("aria-labelledby");
    expect(withCustomLegend).not.toContain("aria-labelledby");
    expect(customLegend).toContain('id="custom-field-legend"');
  });

  test("allocates the seeded id once and restores the previous control on cleanup", () => {
    let controlId: string | undefined = "field-control";
    let labelId: string | undefined;
    let describedBy: string | undefined;
    const relationships = new FieldRelationshipState(
      "field-control",
      () => controlId,
      (next) => (controlId = next),
      () => labelId,
      (next) => (labelId = next),
      () => describedBy,
      (next) => (describedBy = next),
    );

    expect(relationships.resolveDefaultControlId("first-fallback")).toBe("field-control");
    relationships.registerInitialControlId("field-control");
    expect(relationships.resolveDefaultControlId("second-fallback")).toBe("second-fallback");

    const removeFirst = relationships.registerControlId("field-control");
    const removeSecond = relationships.registerControlId("second-fallback");
    expect(controlId).toBe("field-control");
    removeFirst();
    expect(controlId).toBe("second-fallback");
    const removeRemountedFirst = relationships.registerControlId("field-control");
    expect(controlId).toBe("second-fallback");
    removeSecond();
    expect(controlId).toBe("field-control");
    removeRemountedFirst();
    expect(controlId).toBe("field-control");
    expect(relationships.resolveDefaultControlId("remount-fallback")).toBe("field-control");
  });

  test("server-renders explicit Input and NumberField label targets from the root contract", () => {
    const body = render(FieldExplicitControlsSsrFixture).body;
    const inputLabel = body.match(/<label[^>]*data-testid="explicit-input-label"[^>]*>/)?.[0];
    const input = body.match(/<input[^>]*data-testid="explicit-input"[^>]*>/)?.[0];
    const numberLabel = body.match(/<label[^>]*data-testid="explicit-number-label"[^>]*>/)?.[0];
    const number = body.match(/<input[^>]*data-testid="explicit-number"[^>]*>/)?.[0];

    expect(inputLabel).toContain('for="explicit-input"');
    expect(input).toContain('id="explicit-input"');
    expect(numberLabel).toContain('for="explicit-number"');
    expect(number).toContain('id="explicit-number"');
  });

  test("server-renders Field.Control relationships for Root and Item", () => {
    const body = render(FieldControlRelationshipsSsrFixture).body;
    for (const testId of [
      "default-control",
      "default-item-control",
      "explicit-root-control",
      "explicit-item-control",
    ]) {
      const label = body.match(new RegExp(`<label[^>]*data-testid="${testId}-label"[^>]*>`))?.[0];
      const control = body.match(new RegExp(`<input[^>]*data-testid="${testId}"[^>]*>`))?.[0];
      const labelFor = label?.match(/for="([^"]+)"/)?.[1];
      const controlId = control?.match(/id="([^"]+)"/)?.[1];
      expect(labelFor, testId).toBeTruthy();
      expect(controlId, testId).toBe(labelFor);
    }
  });

  test("emits automatic for only on native labels and preserves an explicit consumer for", () => {
    const body = render(FieldLabelPolymorphismSsrFixture).body;
    const element = (testId: string) =>
      body.match(new RegExp(`<[^>]+data-testid="${testId}"[^>]*>`))?.[0];

    expect(element("root-span-label")).toMatch(/^<span\b/);
    expect(element("root-span-label")).not.toMatch(/\sfor=/);
    expect(element("item-span-label")).toMatch(/^<span\b/);
    expect(element("item-span-label")).not.toMatch(/\sfor=/);
    expect(element("explicit-label")).toContain('for="consumer-control"');
    expect(element("explicit-span-label")).toContain('for="consumer-span-control"');
  });
});
