import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionTriggerProps,
} from "./index.js";

test("types all accordion parts, generic values, bindings, callbacks, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    children,
    defaultValue: ["one"],
    disabled: false,
    hiddenUntilFound: false,
    keepMounted: true,
    multiple: true,
    onValueChange: (value) => value,
    ref: null,
    value: ["two"],
  } satisfies AccordionRootProps<string>;
  const item = { children, disabled: false, value: "one" } satisfies AccordionItemProps;
  const header = { as: "h2", children, ref: null } satisfies AccordionHeaderProps;
  const trigger = { children, disabled: false, ref: null } satisfies AccordionTriggerProps;
  const panel = { children, keepMounted: true, ref: null } satisfies AccordionPanelProps;

  expect(root.multiple).toBe(true);
  expect(item.value).toBe("one");
  expect(header.as).toBe("h2");
  expect(trigger.disabled).toBe(false);
  expect(panel.keepMounted).toBe(true);
  expectTypeOf(root.value).toEqualTypeOf<string[]>();
});
