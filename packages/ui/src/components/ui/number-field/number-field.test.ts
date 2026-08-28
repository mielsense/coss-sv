import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as NumberField from "./index.js";
import NumberFieldSSRFixture from "./number-field.ssr-fixture.svelte";
import { clampValue, createNumberLocale, parseNumber } from "./number-field-machine.js";

const text = (value: string) => createRawSnippet(() => ({ render: () => value }));

describe("NumberField number contract", () => {
  test("parses locale decimal and grouping separators", () => {
    expect(parseNumber("1.234,5", createNumberLocale("de-DE"))).toBe(1234.5);
    expect(parseNumber("-1,250.75", createNumberLocale("en-US"))).toBe(-1250.75);
    expect(parseNumber("$1,250.75", createNumberLocale("en-US"))).toBe(1250.75);
    expect(parseNumber("-", createNumberLocale("en-US"))).toBeNull();
    expect(parseNumber("1.", createNumberLocale("en-US"))).toBe(1);
  });

  test("clamps without accumulating decimal precision errors", () => {
    expect(clampValue(10.2, 0, 10)).toBe(10);
    expect(clampValue(-1, 0, 10)).toBe(0);
    expect(clampValue(0.1 + 0.2, undefined, undefined, 0.1)).toBe(0.3);
  });

  test("renders the exact COSS compound structure and classes", () => {
    const children = createRawSnippet(() => ({
      render: () => `<div data-slot="number-field-group"></div>`,
    }));
    const { body } = render(NumberField.Root, {
      props: { children, class: "custom-root", defaultValue: 2, size: "lg" },
    });

    expect(body).toContain('data-slot="number-field"');
    expect(body).toContain('data-size="lg"');
    expect(body).toContain("flex w-full flex-col items-start gap-2 custom-root");
  });

  test("renders group, input, step buttons, scrub label, and fixed icons", () => {
    const body = render(NumberFieldSSRFixture).body;
    expect(body).toContain('role="group"');
    expect(body).toContain('data-slot="number-field-group"');
    expect(body).toContain('aria-roledescription="Number field"');
    expect(body).toContain('aria-label="Decrease"');
    expect(body).toContain("<svg");
    expect(body).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(body).toContain('aria-label="Increase"');
    expect(body.match(/aria-hidden="true"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(body).toContain("Quantity");
    expect(body).toContain(
      '<span class="flex cursor-ew-resize" data-slot="number-field-scrub-area" role="presentation"',
    );
    expect(body).toContain("touch-action: none");
    expect(body).toContain('data-slot="label"');
    expect(render(NumberField.CursorGrowIcon, { props: { class: "cursor" } }).body).toContain(
      "cursor",
    );
  });

  test("renders delegated Root and Group as one element during SSR", () => {
    const body = render(NumberFieldSSRFixture).body;
    expect(body.match(/aria-label="Delegated quantity"/g)).toHaveLength(1);
    expect(body).toContain('aria-label="Delegated quantity"');
    expect(body).toContain('data-slot="number-field"');
    expect(body).toContain('role="group"');
  });

  test("forwards snippets and local barrel aliases", () => {
    const { body } = render(NumberField.Root, { props: { children: text("root content") } });
    expect(body).toContain("root content");
    expect(NumberField.NumberField).toBe(NumberField.Root);
    expect(NumberField.NumberFieldInput).toBe(NumberField.Input);
  });
});
