import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  InputGroupAddonProps,
  InputGroupInputProps,
  InputGroupRootProps,
  InputGroupTextareaProps,
  InputGroupTextProps,
} from "./index.js";

test("types input-group layouts, native controls, callbacks, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = { "aria-label": "Search", children, ref: null } satisfies InputGroupRootProps;
  const addon = { align: "block-end", children, ref: null } satisfies InputGroupAddonProps;
  const text = { children, title: "Protocol" } satisfies InputGroupTextProps;
  const input = {
    name: "query",
    onValueChange: (value: string) => value,
    ref: null,
    size: "sm",
    value: "coss",
  } satisfies InputGroupInputProps;
  const textarea = { name: "notes", ref: null, value: "text" } satisfies InputGroupTextareaProps;

  expect(root["aria-label"]).toBe("Search");
  expect(addon.align).toBe("block-end");
  expect(text.title).toBe("Protocol");
  expect(input.size).toBe("sm");
  expect(textarea.value).toBe("text");

  const invalid = {
    // @ts-expect-error Input Group addons accept only COSS logical alignments.
    align: "center",
  } satisfies InputGroupAddonProps;
  expectTypeOf(invalid.align).toEqualTypeOf<"center">();
});
