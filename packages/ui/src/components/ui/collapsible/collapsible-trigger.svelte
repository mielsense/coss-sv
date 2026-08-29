<script module lang="ts">
  import type { Collapsible as ShardsCollapsible } from "@shardsui/svelte";
  import type { ComponentProps, Snippet } from "svelte";
  import type { ButtonProps } from "../button/button.svelte";
  import type { CollapsibleState } from "./context.js";

  type ShardsCollapsibleTriggerProps = ComponentProps<typeof ShardsCollapsible.Trigger>;
  type CollapsibleTriggerClickEvent = Parameters<
    NonNullable<ShardsCollapsibleTriggerProps["onclick"]>
  >[0];
  type CollapsibleTriggerKeyEvent = Parameters<
    NonNullable<ShardsCollapsibleTriggerProps["onkeydown"]>
  >[0];
  type CollapsibleTriggerMouseEvent = Parameters<
    NonNullable<ShardsCollapsibleTriggerProps["onmousedown"]>
  >[0];
  type CollapsibleTriggerPointerEvent = Parameters<
    NonNullable<ShardsCollapsibleTriggerProps["onpointerdown"]>
  >[0];

  export type CollapsibleTriggerDelegateRef = {
    current: HTMLElement | null;
  };

  export type CollapsibleTriggerDelegateProps = {
    props: Omit<ButtonProps, "disabled" | "ref"> & { disabled?: never };
    ref: CollapsibleTriggerDelegateRef;
    state: CollapsibleState;
  };

  export type CollapsibleTriggerProps = Omit<ShardsCollapsibleTriggerProps, "children"> & {
    children?: Snippet<[CollapsibleState]>;
    delegate?: Snippet<[CollapsibleTriggerDelegateProps]>;
  };
</script>

<script lang="ts">
  import { Collapsible as CollapsiblePrimitive } from "@shardsui/svelte";
  import type { Component } from "svelte";
  import { getCollapsibleDelegateContext } from "./context.js";
  import { makeShardsEventPreventable } from "./event-preventable.js";

  type ForwardedCollapsibleTriggerProps = {
    [key: string]: unknown;
    children?: Snippet<[CollapsibleState]>;
    class?: ShardsCollapsibleTriggerProps["class"];
    disabled?: boolean | undefined;
    onclick?: ShardsCollapsibleTriggerProps["onclick"];
    ref?: HTMLElement | null;
  };

  const StyledCollapsibleTrigger = CollapsiblePrimitive.Trigger as unknown as Component<
    ForwardedCollapsibleTriggerProps,
    object,
    "ref"
  >;

  let {
    children: child,
    class: className,
    delegate,
    disabled: disabledProp,
    onclick,
    onkeydown,
    onkeyup,
    onmousedown,
    onpointerdown,
    ref = $bindable(null),
    ...props
  }: CollapsibleTriggerProps = $props();

  const context = getCollapsibleDelegateContext();
  const state = $derived(context.state);
  const disabled = $derived(disabledProp ?? state.disabled);
  const delegateRef: CollapsibleTriggerDelegateRef = {
    get current() {
      return ref;
    },
    set current(element) {
      ref = element;
    },
  };

  function handleClick(event: MouseEvent): void {
    if (disabled) {
      event.preventDefault();
      return;
    }
    const preventable = makeShardsEventPreventable(event);
    onclick?.(preventable as unknown as CollapsibleTriggerClickEvent);
    if (preventable.shardsUIHandlerPrevented) return;
    context.setOpen(!state.open);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (disabled) {
      if (event.key !== "Tab") event.preventDefault();
      return;
    }
    onkeydown?.(event as CollapsibleTriggerKeyEvent);
  }

  function handleKeyup(event: KeyboardEvent): void {
    if (disabled) return;
    onkeyup?.(event as CollapsibleTriggerKeyEvent);
  }

  function handleMousedown(event: MouseEvent): void {
    if (disabled) return;
    onmousedown?.(event as CollapsibleTriggerMouseEvent);
  }

  function handlePointerdown(event: PointerEvent): void {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onpointerdown?.(event as CollapsibleTriggerPointerEvent);
  }

  const delegateProps = $derived({
    ...props,
    "aria-disabled": disabled ? "true" : "false",
    "aria-controls": state.open ? context.panelId : undefined,
    "aria-expanded": state.open,
    class: className,
    "data-disabled": state.disabled ? "" : undefined,
    "data-ending-style": state.transitionStatus === "ending" ? "" : undefined,
    "data-panel-open": state.open ? "" : undefined,
    "data-slot": "collapsible-trigger",
    "data-starting-style": state.transitionStatus === "starting" ? "" : undefined,
    onclick: handleClick,
    onkeydown: handleKeydown,
    onkeyup: handleKeyup,
    onmousedown: handleMousedown,
    onpointerdown: handlePointerdown,
  } as unknown as Omit<ButtonProps, "children" | "disabled" | "ref"> & {
    disabled?: never;
  });

  const primitiveProps = $derived({
    ...props,
    ...(className == null ? {} : { class: className }),
    ...(disabledProp === undefined ? {} : { disabled: disabledProp }),
    ...(onclick == null ? {} : { onclick }),
    ...(onkeydown == null ? {} : { onkeydown }),
    ...(onkeyup == null ? {} : { onkeyup }),
    ...(onmousedown == null ? {} : { onmousedown }),
    ...(onpointerdown == null ? {} : { onpointerdown }),
  });
</script>

{#if delegate}
  {#snippet delegateChildren()}
    {@render child?.(state)}
  {/snippet}
  {@render delegate({
    props: { ...delegateProps, children: delegateChildren },
    ref: delegateRef,
    state,
  })}
{:else}
  <StyledCollapsibleTrigger bind:ref data-slot="collapsible-trigger" {...primitiveProps}>
    {#snippet children(primitiveState)}
      {@render child?.(primitiveState)}
    {/snippet}
  </StyledCollapsibleTrigger>
{/if}
