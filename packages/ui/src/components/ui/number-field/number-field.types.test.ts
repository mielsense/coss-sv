import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  NumberFieldChangeEventDetails,
  NumberFieldCommitEventDetails,
  NumberFieldGroupProps,
  NumberFieldInputProps,
  NumberFieldRootProps,
  NumberFieldScrubAreaProps,
} from "./index.js";

test("types bindable state, callbacks, formatting, native attributes, snippets, and refs", () => {
  const root = {
    children: createRawSnippet(() => ({ render: () => "content" })),
    defaultValue: 1.5,
    delegate: createRawSnippet<[NumberFieldGroupProps]>((_props) => ({ render: () => "group" })),
    format: { style: "currency", currency: "EUR" },
    locale: "de-DE",
    max: 10,
    min: -10,
    name: "quantity",
    allowOutOfRange: true,
    allowWheelScrub: true,
    largeStep: 10,
    inputRef: null,
    onValueChange: (value: number | null, details: NumberFieldChangeEventDetails) =>
      `${value}:${details.reason}`,
    onValueCommitted: (value: number | null, details: NumberFieldCommitEventDetails) =>
      `${value}:${details.reason}`,
    size: "sm",
    smallStep: 0.1,
    snapOnStep: true,
    step: "any",
    value: 2,
  } satisfies NumberFieldRootProps;
  expect(root.value).toBe(2);

  expectTypeOf<
    Extract<NumberFieldChangeEventDetails, { reason: "wheel" }>["event"]
  >().toEqualTypeOf<WheelEvent>();
  expectTypeOf<
    Extract<NumberFieldChangeEventDetails, { reason: "keyboard" }>["event"]
  >().toEqualTypeOf<KeyboardEvent>();
  expectTypeOf<
    Extract<NumberFieldCommitEventDetails, { reason: "input-blur" }>["event"]
  >().toEqualTypeOf<FocusEvent>();

  const input = {
    "aria-invalid": true,
    "aria-label": "Quantity",
    "aria-valuemax": 10,
    "aria-valuemin": -10,
    "aria-valuenow": 2,
    "aria-valuetext": "2 widgets",
    class: "custom",
    onblur: (_event: FocusEvent) => undefined,
    placeholder: "0",
    ref: null,
  } satisfies NumberFieldInputProps;
  expectTypeOf(input.ref).toEqualTypeOf<null>();

  const removedAria = {
    "aria-describedby": null,
    "aria-labelledby": null,
    "aria-valuemax": null,
    "aria-valuemin": null,
    "aria-valuenow": null,
    "aria-valuetext": null,
  } satisfies NumberFieldInputProps;
  expect(removedAria["aria-valuenow"]).toBeNull();

  const scrub = {
    direction: "vertical",
    label: "Quantity",
    pixelSensitivity: 4,
    teleportDistance: 32,
  } satisfies NumberFieldScrubAreaProps;
  expect(scrub.direction).toBe("vertical");

  const invalid = {
    // @ts-expect-error size names are limited to the COSS contract.
    size: "xl",
  } satisfies NumberFieldRootProps;
  expect(invalid.size).toBe("xl");
});
