import { expect, test } from "vitest";
import type { CheckboxProps } from "./index.js";

test("types Checkbox controlled state, form semantics, callbacks, native attributes, and refs", () => {
  const props = {
    "aria-label": "Accept terms",
    checked: true,
    disabled: false,
    form: "settings",
    indeterminate: false,
    name: "terms",
    onCheckedChange: (_checked: boolean) => undefined,
    onclick: (_event: MouseEvent) => undefined,
    readOnly: false,
    ref: null,
    required: true,
    value: "yes",
  } satisfies CheckboxProps;

  expect(props.name).toBe("terms");
  expect(props.onCheckedChange(true)).toBeUndefined();
});
