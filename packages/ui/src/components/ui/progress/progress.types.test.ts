import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type { ProgressRootProps, ProgressStatus, ProgressValueProps } from "./index.js";

test("types Progress indeterminate values, formats, state snippets, and refs", () => {
  const root = {
    "aria-label": "Upload",
    max: 100,
    min: 0,
    ref: null,
    value: null,
  } satisfies ProgressRootProps;
  const value = {
    children: createRawSnippet<[string, number | null]>((_formatted, raw) => ({
      render: () => `${raw}`,
    })),
  } satisfies ProgressValueProps;
  const status: ProgressStatus = "progressing";
  expect(root.value).toBeNull();
  expect(status).toBe("progressing");
  expect(value.children).toBeTypeOf("function");
});
