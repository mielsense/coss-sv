import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import { createHandle } from "./index.js";
import type { DialogFooterProps, DialogPopupProps, DialogTriggerProps } from "./index.js";

test("types Dialog parts and Shards callbacks", () => {
  const popup = {
    bottomStickOnMobile: false,
    children: createRawSnippet(() => ({ render: () => "Body" })),
    initialFocus: true,
    showCloseButton: false,
  } satisfies DialogPopupProps;
  const trigger = { disabled: true, ref: null } satisfies DialogTriggerProps;
  const footer = { as: "footer", variant: "bare" } satisfies DialogFooterProps;
  expect(popup.bottomStickOnMobile).toBe(false);
  expectTypeOf(trigger.ref).toEqualTypeOf<null>();
  expect(footer.as).toBe("footer");
  const invalid = {
    // @ts-expect-error Dialog footer only supports the two COSS variants.
    variant: "floating",
  } satisfies DialogFooterProps;
  expect(invalid.variant).toBe("floating");
});

test("preserves the Dialog payload type through handles and triggers", () => {
  const handle = createHandle<{ id: number }>();
  const valid = { handle, payload: { id: 1 } } satisfies DialogTriggerProps<{ id: number }>;
  const invalid = {
    handle,
    // @ts-expect-error Dialog payload must match its parameterized handle.
    payload: { id: "wrong" },
  } satisfies DialogTriggerProps<{ id: number }>;
  expect(valid.payload.id).toBe(1);
  expect(invalid.payload.id).toBe("wrong");
});
