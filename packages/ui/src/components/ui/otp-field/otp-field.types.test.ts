import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { OTPFieldInputProps, OTPFieldRootProps } from "./index.js";

test("types length, value binding, validation callbacks, native input props, and refs", () => {
  const root = {
    children: createRawSnippet(() => ({ render: () => "slots" })),
    length: 6,
    normalizeValue: (value: string) => value.toUpperCase(),
    onComplete: (value: string) => value,
    onValueChange: (value: string) => value,
    onValueInvalid: (value: string) => value,
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
