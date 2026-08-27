import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  CheckboxGroupChangeEventDetails,
  CheckboxGroupItemProps,
  CheckboxGroupRootProps,
} from "./index.js";

test("types root state, parent items, callbacks, native attributes, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    "aria-label": "Frameworks",
    allValues: ["next", "vite"],
    as: "section",
    children,
    class: "custom",
    defaultValue: ["next"],
    disabled: false,
    onValueChange: (value, details) => {
      details.allowPropagation();
      details.cancel();
      expectTypeOf(details.event).toEqualTypeOf<Event>();
      expectTypeOf(details.isCanceled).toEqualTypeOf<boolean>();
      expectTypeOf(details.isPropagationAllowed).toEqualTypeOf<boolean>();
      expectTypeOf(details.reason).toEqualTypeOf<"none">();
      expectTypeOf(details.trigger).toEqualTypeOf<Element | undefined>();
      return value;
    },
    ref: null,
    value: ["vite"],
  } satisfies CheckboxGroupRootProps<"next" | "vite">;
  const item = {
    "aria-label": "All frameworks",
    children,
    disabled: false,
    indeterminate: false,
    onCheckedChange: (checked) => checked,
    parent: true,
    ref: null,
  } satisfies CheckboxGroupItemProps;

  expect(root.allValues).toEqual(["next", "vite"]);
  expect(root.value).toEqual(["vite"]);
  expect(item.parent).toBe(true);

  expectTypeOf<CheckboxGroupChangeEventDetails["allowPropagation"]>().toEqualTypeOf<() => void>();
  expectTypeOf<CheckboxGroupChangeEventDetails["cancel"]>().toEqualTypeOf<() => void>();
  expectTypeOf<CheckboxGroupChangeEventDetails["event"]>().toEqualTypeOf<Event>();
  expectTypeOf<CheckboxGroupChangeEventDetails["isCanceled"]>().toEqualTypeOf<boolean>();
  expectTypeOf<CheckboxGroupChangeEventDetails["isPropagationAllowed"]>().toEqualTypeOf<boolean>();
  expectTypeOf<CheckboxGroupChangeEventDetails["reason"]>().toEqualTypeOf<"none">();
  expectTypeOf<CheckboxGroupChangeEventDetails["trigger"]>().toEqualTypeOf<Element | undefined>();

  const invalid = {
    // @ts-expect-error Checkbox Group values must be strings.
    value: [1],
  } satisfies CheckboxGroupRootProps;
  expectTypeOf(invalid.value).toEqualTypeOf<number[]>();
});
