import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  PaginationEllipsisProps,
  PaginationLinkDelegateProps,
  PaginationLinkDelegateRef,
  PaginationLinkProps,
  PaginationProps,
} from "./index.js";

test("types pagination native attributes, snippets and link options", () => {
  const root = {
    "aria-label": "Results pages",
    children: createRawSnippet(() => ({ render: () => "Pages" })),
    class: "custom",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies PaginationProps;

  const link = {
    as: "a",
    children: createRawSnippet(() => ({ render: () => "2" })),
    href: "/page/2",
    isActive: true,
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
    size: "icon-sm",
  } satisfies PaginationLinkProps;

  const delegate = createRawSnippet((getDelegateProps) => ({
    render: () =>
      `${getDelegateProps().props.class ?? ""}:${getDelegateProps().ref.current?.tagName ?? ""}`,
  })) satisfies NonNullable<PaginationLinkProps["delegate"]>;
  const delegatedLink = { delegate } satisfies PaginationLinkProps;

  const ellipsis = {
    class: "custom",
    ref: null,
    title: "Skipped pages",
  } satisfies PaginationEllipsisProps;

  expectTypeOf(root.ref).toEqualTypeOf<null>();
  expectTypeOf(link.size).toEqualTypeOf<"icon-sm">();
  expectTypeOf(delegatedLink.delegate).toEqualTypeOf<
    NonNullable<PaginationLinkProps["delegate"]>
  >();
  expectTypeOf<PaginationLinkDelegateProps["props"]["disabled"]>().toMatchTypeOf<
    boolean | null | undefined
  >();
  expectTypeOf<PaginationLinkDelegateProps["ref"]>().toEqualTypeOf<PaginationLinkDelegateRef>();
  expectTypeOf<PaginationLinkDelegateRef["current"]>().toEqualTypeOf<HTMLElement | null>();
  expect(ellipsis.title).toBe("Skipped pages");
});

test("rejects unknown button sizes", () => {
  const invalid = {
    // @ts-expect-error Pagination links use the COSS button size vocabulary.
    size: "tiny",
  } satisfies PaginationLinkProps;
  expect(invalid.size).toBe("tiny");
});
