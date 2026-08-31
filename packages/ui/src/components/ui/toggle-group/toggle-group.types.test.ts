import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  ToggleGroupChangeEventDetails,
  ToggleGroupItemProps,
  ToggleGroupRootProps,
  ToggleGroupSeparatorProps,
} from "./index.js";

test("types root selection, item toggles, separators, callbacks, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    "aria-label": "Text formatting",
    children,
    defaultValue: ["bold"],
    disabled: false,
    loopFocus: false,
    multiple: true,
    onValueChange: (value, details: ToggleGroupChangeEventDetails) => {
      details.cancel();
      return value;
    },
    orientation: "vertical",
    ref: null,
    size: "lg",
    value: ["italic"],
    variant: "outline",
  } satisfies ToggleGroupRootProps<"bold" | "italic">;
  const item = {
    "aria-label": "Toggle bold",
    children,
    disabled: false,
    onPressedChange: (pressed, details) => {
      details.cancel();
      return pressed;
    },
    pressed: true,
    ref: null,
    value: "bold",
  } satisfies ToggleGroupItemProps;
  const separator = {
    "aria-label": "Formatting divider",
    orientation: "horizontal",
    ref: null,
  } satisfies ToggleGroupSeparatorProps;

  expect(root.orientation).toBe("vertical");
  expect(item.value).toBe("bold");
  expect(separator.orientation).toBe("horizontal");

  const invalidOrientation = {
    // @ts-expect-error Toggle Group only accepts horizontal or vertical orientation.
    orientation: "diagonal",
  } satisfies ToggleGroupRootProps;
  expectTypeOf(invalidOrientation.orientation).toEqualTypeOf<"diagonal">();
});
