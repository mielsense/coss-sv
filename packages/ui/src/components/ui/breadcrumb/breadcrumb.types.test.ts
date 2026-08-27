import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { BreadcrumbLinkProps, BreadcrumbNavProps, BreadcrumbSeparatorProps } from "./index.js";

test("types breadcrumb native attributes, snippets, refs, and the link element translation", () => {
  const children = createRawSnippet(() => ({ render: () => "Home" }));
  const nav = {
    "aria-label": "Project breadcrumb",
    children,
    class: "custom",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies BreadcrumbNavProps;
  const link = {
    as: "button",
    children,
    onclick: (_event: MouseEvent) => undefined,
    type: "button",
  } satisfies BreadcrumbLinkProps;
  const separator = { children, ref: null } satisfies BreadcrumbSeparatorProps;

  expect(nav.class).toBe("custom");
  expect(link.as).toBe("button");
  expectTypeOf(separator.ref).toEqualTypeOf<null>();
});
