import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { TableCellProps, TableHeadProps, TableProps, TableVariant } from "./index.js";

test("types table variants, native attributes, snippets and refs", () => {
  const table = {
    "aria-describedby": "caption",
    children: createRawSnippet(() => ({ render: () => "Rows" })),
    class: "custom",
    containerAs: "section",
    containerClass: "outer",
    containerId: "scroll-region",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
    variant: "card",
  } satisfies TableProps;

  const head = {
    abbr: "Project",
    children: createRawSnippet(() => ({ render: () => "Project" })),
    colspan: 2,
    ref: null,
    scope: "col",
  } satisfies TableHeadProps;

  const cell = {
    children: createRawSnippet(() => ({ render: () => "Website" })),
    colspan: 2,
    headers: "project",
    ref: null,
  } satisfies TableCellProps;

  expectTypeOf<TableVariant>().toEqualTypeOf<"default" | "card">();
  expectTypeOf(table.variant).toEqualTypeOf<"card">();
  expect(head.scope).toBe("col");
  expect(cell.headers).toBe("project");
});

test("rejects unsupported table variants", () => {
  const invalid = {
    // @ts-expect-error Table only supports the COSS default and card variants.
    variant: "striped",
  } satisfies TableProps;
  expect(invalid.variant).toBe("striped");
});
