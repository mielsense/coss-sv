import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import FieldSsrFixture from "./field.ssr-fixture.svelte";
import FieldExplicitControlsSsrFixture from "./field-explicit-controls.ssr-fixture.svelte";
import FieldFieldsetSsrFixture from "./field-fieldset.ssr-fixture.svelte";
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
    expect(body).toMatch(/<fieldset[^>]* disabled(?:="")?/);
    expect(body).toContain("data-disabled");
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
});
