import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { RadioGroupItemProps, RadioGroupRootProps } from "./index.js";

test("types generic values, form semantics, callbacks, native attributes, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    "aria-label": "Framework",
    children,
    defaultValue: "vite",
    disabled: false,
    form: "settings",
    name: "framework",
    onValueChange: (value) => value,
    readOnly: false,
    ref: null,
    required: true,
    value: "next",
  } satisfies RadioGroupRootProps<"next" | "vite">;
  const item = {
    "aria-label": "Vite",
    disabled: false,
    onclick: (_event: MouseEvent) => undefined,
    readOnly: false,
    ref: null,
    required: true,
    value: "vite",
  } satisfies RadioGroupItemProps<"next" | "vite">;

  expect(root.defaultValue).toBe("vite");
  expect(root.onValueChange("next")).toBe("next");
  expect(item.value).toBe("vite");

  const invalid = {
    // @ts-expect-error Radio Group values stay inside the declared generic union.
    value: "astro",
  } satisfies RadioGroupRootProps<"next" | "vite">;
  expectTypeOf(invalid.value).toEqualTypeOf<"astro">();
});
