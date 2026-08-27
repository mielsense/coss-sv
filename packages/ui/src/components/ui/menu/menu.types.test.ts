import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type {
  MenuCheckboxItemProps,
  MenuItemProps,
  MenuPopupProps,
  MenuRadioGroupProps,
  MenuRootProps,
  MenuShortcutProps,
  MenuSubPopupProps,
  MenuTriggerProps,
} from "./index.js";

test("types Menu defaults, bindings, callbacks, variants, snippets, portals, and refs", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    children,
    defaultOpen: true,
    disabled: false,
    modal: false,
    onOpenChange: (open) => open,
    open: false,
    triggerId: "menu-trigger",
  } satisfies MenuRootProps;
  const trigger = { children, openOnHover: true, ref: null } satisfies MenuTriggerProps;
  const popup = {
    align: "start",
    anchor: null,
    children,
    portalProps: { keepMounted: true },
    ref: null,
    side: "bottom",
    sideOffset: 4,
  } satisfies MenuPopupProps;
  const item = { children, inset: true, variant: "destructive" } satisfies MenuItemProps;
  const checkbox = {
    checked: false,
    defaultChecked: true,
    onCheckedChange: (checked) => checked,
    variant: "switch",
  } satisfies MenuCheckboxItemProps;
  const radio = {
    defaultValue: "system",
    onValueChange: (value) => value,
    value: "dark",
  } satisfies MenuRadioGroupProps<string>;
  const subPopup = { align: "center", sideOffset: 0 } satisfies MenuSubPopupProps;
  const shortcut = { children, ref: null } satisfies MenuShortcutProps;

  expect(root.defaultOpen).toBe(true);
  expect(trigger.openOnHover).toBe(true);
  expect(popup.portalProps.keepMounted).toBe(true);
  expect(item.variant).toBe("destructive");
  expect(checkbox.variant).toBe("switch");
  expect(radio.value).toBe("dark");
  expect(subPopup.align).toBe("center");
  expect(shortcut.ref).toBeNull();
});
