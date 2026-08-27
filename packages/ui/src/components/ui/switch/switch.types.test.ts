import { expect, test } from "vitest";
import type { SwitchProps } from "./index.js";

test("types Switch controlled state, form semantics, callbacks, native attributes, and refs", () => {
  const props = {
    "aria-label": "Marketing emails",
    checked: true,
    disabled: false,
    form: "settings",
    name: "marketing",
    onCheckedChange: (_checked: boolean) => undefined,
    onclick: (_event: MouseEvent) => undefined,
    readOnly: false,
    ref: null,
    required: true,
    value: "yes",
  } satisfies SwitchProps;

  expect(props.name).toBe("marketing");
  expect(props.onCheckedChange(true)).toBeUndefined();
});
