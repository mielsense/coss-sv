import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import FieldSsrFixture from "./field.ssr-fixture.svelte";
import FieldFieldsetSsrFixture from "./field-fieldset.ssr-fixture.svelte";
import * as Field from "./index.js";

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
});
