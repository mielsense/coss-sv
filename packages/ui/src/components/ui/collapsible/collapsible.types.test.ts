import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  CollapsiblePanelProps,
  CollapsibleRootProps,
  CollapsibleTriggerDelegateProps,
  CollapsibleTriggerDelegateRef,
  CollapsibleTriggerProps,
} from "./index.js";

test("types root, trigger, panel, bindable state, callbacks, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    children,
    defaultOpen: true,
    disabled: false,
    onOpenChange: (open) => open,
    open: false,
    ref: null,
  } satisfies CollapsibleRootProps;
  const trigger = { children, disabled: false, ref: null } satisfies CollapsibleTriggerProps;
  const delegate = createRawSnippet((getDelegateProps) => ({
    render: () =>
      `${getDelegateProps().props["aria-expanded"]}:${getDelegateProps().ref.current?.tagName ?? ""}`,
  })) satisfies NonNullable<CollapsibleTriggerProps["delegate"]>;
  const delegatedTrigger = { children, delegate } satisfies CollapsibleTriggerProps;
  const panel = {
    children,
    hiddenUntilFound: false,
    keepMounted: true,
    ref: null,
  } satisfies CollapsiblePanelProps;

  expect(root.defaultOpen).toBe(true);
  expect(trigger.disabled).toBe(false);
  expectTypeOf(delegatedTrigger.delegate).toEqualTypeOf<
    NonNullable<CollapsibleTriggerProps["delegate"]>
  >();
  expectTypeOf<CollapsibleTriggerDelegateProps["props"]["disabled"]>().toEqualTypeOf<undefined>();
  expectTypeOf<
    CollapsibleTriggerDelegateProps["ref"]
  >().toEqualTypeOf<CollapsibleTriggerDelegateRef>();
  expectTypeOf<CollapsibleTriggerDelegateRef["current"]>().toEqualTypeOf<HTMLElement | null>();
  expect(panel.keepMounted).toBe(true);
});
