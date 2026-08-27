import { expect, expectTypeOf, test } from "vitest";
import type { TextareaProps, TextareaSize } from "./index.js";

test("types native textarea attributes and COSS options", () => {
  expectTypeOf<TextareaSize>().toEqualTypeOf<"sm" | "default" | "lg" | number>();
  const props = {
    defaultValue: "Initial draft",
    maxlength: 120,
    name: "message",
    oninput: (_event: Event & { currentTarget: HTMLTextAreaElement }) => undefined,
    onValueChange: (_value: string) => undefined,
    readonly: true,
    ref: null,
    rows: 4,
    size: "lg",
    value: "Draft",
  } satisfies TextareaProps;
  expect(props.rows).toBe(4);

  const invalid = {
    // @ts-expect-error COSS only defines three named sizes.
    size: "xl",
  } satisfies TextareaProps;
  expectTypeOf(invalid.size).toEqualTypeOf<"xl">();
});
