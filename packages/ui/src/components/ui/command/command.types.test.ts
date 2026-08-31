import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  CommandDialogBackdropProps,
  CommandDialogPopupProps,
  CommandDialogRootProps,
  CommandDialogViewportProps,
  CommandFooterProps,
  CommandGroupLabelProps,
  CommandGroupProps,
  CommandInputProps,
  CommandPanelProps,
  CommandRootProps,
} from "./index.js";

test("types command native attributes, dialog portal props, and structural regions", () => {
  const children = createRawSnippet(() => ({ render: () => "Content" }));
  const input = { "aria-label": "Search", placeholder: "Search…" } satisfies CommandInputProps;
  const popup = { children, portalProps: { keepMounted: true } } satisfies CommandDialogPopupProps;
  const dialogRoot = { defaultOpen: true } satisfies CommandDialogRootProps;
  const backdrop = { class: "overlay" } satisfies CommandDialogBackdropProps;
  const viewport = { children } satisfies CommandDialogViewportProps;
  const panel = { children } satisfies CommandPanelProps;
  const footer = { children } satisfies CommandFooterProps;
  const group = {
    as: "section",
    children,
    class: "consumer-group",
    items: ["Figma"],
    ref: null,
  } satisfies CommandGroupProps;
  const groupLabel = {
    as: "h3",
    children,
    class: "consumer-label",
    id: "suggestions-label",
    ref: null,
  } satisfies CommandGroupLabelProps;
  const root = {
    defaultValue: "Fi",
    items: ["Figma"],
    onValueChange: (_value: string, details) => details.cancel(),
    value: "",
  } satisfies CommandRootProps;
  expect(input.placeholder).toBe("Search…");
  expect(popup.portalProps?.keepMounted).toBe(true);
  expect(dialogRoot.defaultOpen).toBe(true);
  expect(backdrop.class).toBe("overlay");
  expect(viewport.children).toBe(children);
  expect(panel.children).toBe(children);
  expect(footer.children).toBe(children);
  expect(group.items).toEqual(["Figma"]);
  expect(groupLabel.id).toBe("suggestions-label");
  expectTypeOf(root.onValueChange).parameter(0).toEqualTypeOf<string>();
  expectTypeOf(root.onValueChange).parameter(1).toMatchTypeOf<{
    isCanceled: boolean;
    reason: string;
  }>();
});
