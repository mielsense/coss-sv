import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type {
  ToolbarButtonProps,
  ToolbarGroupProps,
  ToolbarInputProps,
  ToolbarLinkProps,
  ToolbarRootProps,
  ToolbarSeparatorProps,
} from "./index.js";

test("types Toolbar orientation, direction, native attributes, callbacks, snippets, and refs", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    children,
    dir: "rtl",
    disabled: false,
    loopFocus: false,
    orientation: "vertical",
    ref: null,
  } satisfies ToolbarRootProps;
  const button = {
    children,
    disabled: true,
    onclick: () => undefined,
    ref: null,
  } satisfies ToolbarButtonProps;
  const link = { children, href: "/docs", ref: null } satisfies ToolbarLinkProps;
  const input = { "aria-label": "Search", value: "query" } satisfies ToolbarInputProps;
  const group = { children, disabled: true } satisfies ToolbarGroupProps;
  const separator = { orientation: "horizontal" } satisfies ToolbarSeparatorProps;

  expect(root.orientation).toBe("vertical");
  expect(button.disabled).toBe(true);
  expect(link.href).toBe("/docs");
  expect(input.value).toBe("query");
  expect(group.disabled).toBe(true);
  expect(separator.orientation).toBe("horizontal");
});
