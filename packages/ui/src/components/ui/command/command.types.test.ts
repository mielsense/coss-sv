import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  CommandDialogBackdropProps,
  CommandDialogPopupProps,
  CommandDialogViewportProps,
  CommandFooterProps,
  CommandInputProps,
  CommandPanelProps,
  CommandRootProps,
} from "./index.js";
test("types command native attributes, dialog portal props, and structural regions", () => {
  const children = createRawSnippet(() => ({ render: () => "Content" }));
  const input = { "aria-label": "Search", placeholder: "Search…" } satisfies CommandInputProps;
  const popup = { children, portalProps: { keepMounted: true } } satisfies CommandDialogPopupProps;
  const backdrop = { class: "overlay" } satisfies CommandDialogBackdropProps;
  const viewport = { children } satisfies CommandDialogViewportProps;
  const panel = { children } satisfies CommandPanelProps;
  const footer = { children } satisfies CommandFooterProps;
  const root = {
    items: ["Figma"],
    onValueChange: (_value: string) => undefined,
    value: "",
  } satisfies CommandRootProps;
  expect(input.placeholder).toBe("Search…");
  expect(popup.portalProps?.keepMounted).toBe(true);
  expect(backdrop.class).toBe("overlay");
  expect(viewport.children).toBe(children);
  expect(panel.children).toBe(children);
  expect(footer.children).toBe(children);
  expectTypeOf(root.onValueChange).parameter(0).toEqualTypeOf<string>();
});
