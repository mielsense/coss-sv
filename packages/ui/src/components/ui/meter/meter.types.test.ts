import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type { MeterIndicatorProps, MeterRootProps, MeterValueProps } from "./index.js";

test("types Meter ranges, formatting, snippets, styles, and refs", () => {
  const root = {
    "aria-label": "Usage",
    format: { style: "percent" },
    locale: "en",
    max: 100,
    min: 0,
    ref: null,
    value: 50,
  } satisfies MeterRootProps;
  const value = {
    children: createRawSnippet<[string, number]>((_formatted, raw) => ({ render: () => `${raw}` })),
  } satisfies MeterValueProps;
  const indicator = { ref: null, style: "opacity:.5" } satisfies MeterIndicatorProps;
  expect(root.value).toBe(50);
  expect(value.children).toBeTypeOf("function");
  expect(indicator.style).toBe("opacity:.5");
});
