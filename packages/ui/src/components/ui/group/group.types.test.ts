import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  GroupRootProps,
  GroupSeparatorProps,
  GroupTextDelegateProps,
  GroupTextProps,
} from "./index.js";

test("types group orientation, native attributes, polymorphic text, and separators", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    "aria-label": "Actions",
    children,
    orientation: "vertical",
    ref: null,
  } satisfies GroupRootProps;
  const text = { as: "label", children, for: "query", ref: null } satisfies GroupTextProps;
  const delegate = createRawSnippet<[GroupTextDelegateProps]>((getProps) => ({
    render: () => `<label>${getProps().class ?? ""}</label>`,
  }));
  const delegatedText = {
    "aria-label": "Domain",
    children,
    delegate,
    for: "domain",
  } satisfies GroupTextProps;
  const separator = { orientation: "horizontal", ref: null } satisfies GroupSeparatorProps;

  expect(root.orientation).toBe("vertical");
  expect(text.as).toBe("label");
  expect(delegatedText.delegate).toBe(delegate);
  expect(separator.orientation).toBe("horizontal");

  const invalid = {
    // @ts-expect-error Group only accepts horizontal or vertical orientation.
    orientation: "diagonal",
  } satisfies GroupRootProps;
  expectTypeOf(invalid.orientation).toEqualTypeOf<"diagonal">();
});
