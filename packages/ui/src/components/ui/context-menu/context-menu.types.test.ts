import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuItemProps,
  ContextMenuPopupProps,
  ContextMenuRadioGroupProps,
  ContextMenuRootProps,
  ContextMenuTriggerProps,
} from "./index.js";

test("types Context Menu defaults, point trigger, state, variants, portal, and ref props", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = { children, defaultOpen: true, open: false } satisfies ContextMenuRootProps;
  const trigger = { as: "div", children, ref: null } satisfies ContextMenuTriggerProps;
  const popup = {
    align: "center",
    children,
    portalProps: { keepMounted: true },
    sideOffset: 4,
  } satisfies ContextMenuPopupProps;
  const item = { inset: true, variant: "destructive" } satisfies ContextMenuItemProps;
  const checkbox = {
    defaultChecked: true,
    variant: "switch",
  } satisfies ContextMenuCheckboxItemProps;
  const radio = {
    defaultValue: "system",
    value: "light",
  } satisfies ContextMenuRadioGroupProps<string>;

  expect(root.defaultOpen).toBe(true);
  expect(trigger.as).toBe("div");
  expect(popup.portalProps.keepMounted).toBe(true);
  expect(item.variant).toBe("destructive");
  expect(checkbox.variant).toBe("switch");
  expect(radio.value).toBe("light");
});
