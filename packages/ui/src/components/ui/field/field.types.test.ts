import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldItemProps,
  FieldLabelProps,
  FieldRootProps,
} from "./index.js";

test("types the full Field state, validation, relationships, and polymorphic parts", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    as: "fieldset",
    children,
    controlId: "email-control",
    dirty: true,
    disabled: false,
    invalid: true,
    name: "email",
    touched: true,
    validate: (value: unknown) => (value ? null : "Required"),
    validationDebounceTime: 20,
    validationMode: "onBlur",
  } satisfies FieldRootProps;
  const label = { as: "span", children, id: "label", ref: null } satisfies FieldLabelProps;
  const control = {
    "aria-describedby": "help",
    as: "textarea",
    id: "control",
    name: "email",
    onValueChange: (value: string) => value,
    ref: null,
    value: "miel",
  } satisfies FieldControlProps;
  const item = { children, controlId: "choice-control", disabled: true } satisfies FieldItemProps;
  const description = { children, id: "help" } satisfies FieldDescriptionProps;
  const error = { children, match: "valueMissing" } satisfies FieldErrorProps;

  expect(root.name).toBe("email");
  expect(root.as).toBe("fieldset");
  expect(root.controlId).toBe("email-control");
  expect(label.as).toBe("span");
  expect(control.as).toBe("textarea");
  expect(item.disabled).toBe(true);
  expect(item.controlId).toBe("choice-control");
  expect(description.id).toBe("help");
  expect(error.match).toBe("valueMissing");

  const invalidMode = {
    // @ts-expect-error Field accepts only Shards validation modes.
    validationMode: "onFocus",
  } satisfies FieldRootProps;
  expectTypeOf(invalidMode.validationMode).toEqualTypeOf<"onFocus">();
});
