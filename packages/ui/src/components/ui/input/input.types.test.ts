import { expect, expectTypeOf, test } from "vitest";
import type { InputProps, InputSize } from "./index.js";

test("types native input attributes and COSS options", () => {
  expectTypeOf<InputSize>().toEqualTypeOf<"sm" | "default" | "lg" | number>();

  const props = {
    "aria-describedby": "help",
    "aria-invalid": "grammar",
    "aria-label": "Upload",
    "aria-labelledby": "upload-label",
    class: "w-full",
    defaultValue: "report.csv",
    disabled: true,
    name: "upload",
    nativeInput: true,
    onchange: (_event: Event & { currentTarget: HTMLInputElement }) => undefined,
    onValueChange: (_value: string) => undefined,
    ref: null,
    size: 7,
    type: "file",
    unstyled: true,
  } satisfies InputProps;

  expect(props.type).toBe("file");
  expectTypeOf(props.size).toEqualTypeOf<number>();

  const invalid = {
    // @ts-expect-error COSS only defines three named sizes.
    size: "xl",
  } satisfies InputProps;
  expectTypeOf(invalid.size).toEqualTypeOf<"xl">();

  const removedRelationships = {
    "aria-labelledby": null,
  } satisfies InputProps;
  expect(removedRelationships["aria-labelledby"]).toBeNull();
});
