import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as NumberField from "./index.js";
import NumberFieldSSRFixture from "./number-field.ssr-fixture.svelte";
import NumberFieldFieldHydrationFixture from "./number-field-field.hydration-fixture.svelte";
import { numberFieldHydrationHtml } from "./number-field-field.hydration-html.js";
import NumberFieldFieldSSRFixture from "./number-field-field.ssr-fixture.svelte";
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
    expect(body).toContain('role="spinbutton"');
    expect(body).toContain('aria-roledescription="Number field"');
    expect(body).toContain('aria-valuenow="2"');
    expect(body).toContain('aria-valuemin="0"');
    expect(body).toContain('aria-valuemax="10"');
    expect(body).toContain('aria-valuetext="2"');
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

  test("server-renders the unlabeled range fallback as a named spinbutton", () => {
    const body = render(NumberFieldSSRFixture).body;
    const input = body.match(/<input[^>]*data-testid="ssr-unnamed-number"[^>]*>/)?.[0];

    expect(input).toContain('role="spinbutton"');
    expect(input).toContain('aria-label="Number field"');
    expect(input).toContain('aria-roledescription="Number field"');
    expect(input).toContain('aria-valuenow="5"');
    expect(input).toContain('aria-valuemin="0"');
    expect(input).toContain('aria-valuemax="10"');
  });

  test("server-renders enclosing Field relationships for NumberField inputs", () => {
    const body = render(NumberFieldFieldSSRFixture).body;
    const fieldInput = body.match(/<input[^>]*data-testid="ssr-field-number-input"[^>]*>/)?.[0];
    const scrubInput = body.match(
      /<input[^>]*data-testid="ssr-field-scrub-number-input"[^>]*>/,
    )?.[0];
    const removedInput = body.match(
      /<input[^>]*data-testid="ssr-null-field-number-input"[^>]*>/,
    )?.[0];

    expect(fieldInput).toContain('aria-labelledby="ssr-field-number-label"');
    expect(fieldInput).toContain(
      'aria-describedby="ssr-field-number-description ssr-field-number-error"',
    );
    expect(fieldInput).toContain('aria-invalid="true"');
    expect(scrubInput).toMatch(/aria-labelledby="s\d+"/);
    expect(scrubInput).toContain('aria-describedby="ssr-field-scrub-number-description"');
    expect(removedInput).not.toContain("aria-labelledby");
    expect(removedInput).not.toContain("aria-describedby");
  });

  test("keeps the committed Field hydration markup synchronized with server output", () => {
    const body = render(NumberFieldFieldHydrationFixture).body;
    const label = body.match(/<label[^>]*>[^<]*<!---->Hydrated quantity/)?.[0];
    const input = body.match(/<input[^>]*data-testid="hydrated-field-number-input"[^>]*>/)?.[0];
    const labelFor = label?.match(/for="([^"]+)"/)?.[1];
    const inputId = input?.match(/id="([^"]+)"/)?.[1];

    expect(labelFor).toBeTruthy();
    expect(inputId).toBe(labelFor);
    expect(numberFieldHydrationHtml).toBe(body);
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
