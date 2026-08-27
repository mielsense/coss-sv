import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type {
  SliderControlProps,
  SliderRootProps,
  SliderThumbProps,
  SliderValueProps,
  SliderValueType,
} from "./index.js";

test("types scalar, range, bindable, state snippet, ref, and part contracts", () => {
  const scalar = {
    "aria-label": "Volume",
    defaultValue: 30,
    max: 100,
    min: 0,
    onValueChange: (value: number | readonly number[]) => value,
    ref: null,
    value: 20,
  } satisfies SliderRootProps;
  const range = {
    "aria-label": "Price range",
    defaultValue: [20, 80] as const,
    minStepsBetweenValues: 2,
    thumbCollisionBehavior: "push",
    value: [25, 75] as const,
  } satisfies SliderRootProps;
  const control = {
    children: createRawSnippet<[unknown]>((_state) => ({ render: () => "track" })),
    ref: null,
  } satisfies SliderControlProps;
  const thumb = { "aria-label": "Minimum", index: 0, ref: null } satisfies SliderThumbProps;
  const value = {
    children: createRawSnippet<[string[], number[]]>((_formatted, _raw) => ({
      render: () => "value",
    })),
  } satisfies SliderValueProps;
  const numericValue: SliderValueType = [25, 75] as const;

  expect(scalar.value).toBe(20);
  expect(range.value).toEqual([25, 75]);
  expect(control.children).toBeTypeOf("function");
  expect(thumb.index).toBe(0);
  expect(value.children).toBeTypeOf("function");
  expect(numericValue).toEqual([25, 75]);
});
