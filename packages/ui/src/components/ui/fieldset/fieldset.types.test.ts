import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type { FieldsetLegendProps, FieldsetRootProps } from "./index.js";

test("types disabled fieldsets, legends, refs, and polymorphism", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = { as: "fieldset", children, disabled: true, ref: null } satisfies FieldsetRootProps;
  const legend = { as: "legend", children, id: "legend", ref: null } satisfies FieldsetLegendProps;

  expect(root.disabled).toBe(true);
  expect(legend.as).toBe("legend");
  expect(root.ref).toBeNull();
});
