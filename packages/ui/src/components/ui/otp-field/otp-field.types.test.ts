import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  OTPFieldChangeEventDetails,
  OTPFieldCompleteEventDetails,
  OTPFieldInputProps,
  OTPFieldInvalidEventDetails,
  OTPFieldRootProps,
} from "./index.js";

test("types length, value binding, validation callbacks, native input props, and refs", () => {
  const root = {
    children: createRawSnippet(() => ({ render: () => "slots" })),
    autoComplete: "one-time-code",
    autoSubmit: true,
    form: "verification-form",
    id: "verification-code",
    inputMode: "numeric",
    length: 6,
    normalizeValue: (value: string) => value.toUpperCase(),
    onValueChange: (value: string, details: OTPFieldChangeEventDetails) => {
      details.cancel();
      return value;
    },
    onValueComplete: (value: string, details: OTPFieldCompleteEventDetails) =>
      `${value}:${details.reason}`,
    onValueInvalid: (value: string, details: OTPFieldInvalidEventDetails) =>
      `${value}:${details.reason}`,
    size: "lg",
    validationType: "alphanumeric",
    value: "A7C9XZ",
  } satisfies OTPFieldRootProps;
  expect(root.length).toBe(6);

  const input = {
    "aria-invalid": true,
    onfocus: (_event: FocusEvent) => undefined,
    placeholder: "•",
    ref: null,
  } satisfies OTPFieldInputProps;
  expectTypeOf(input.ref).toEqualTypeOf<null>();

  const invalid = {
    length: 4,
    // @ts-expect-error validation modes match the upstream API.
    validationType: "hex",
  } satisfies OTPFieldRootProps;
  expect(invalid.length).toBe(4);
});
