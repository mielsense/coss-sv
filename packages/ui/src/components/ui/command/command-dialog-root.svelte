<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  import type { SelectionChangeEventDetails } from "@/change-event-details.js";

  type BaseProps = ComponentProps<typeof ShardsDialog.Root>;
  export type CommandDialogChangeEventDetails = SelectionChangeEventDetails;
  export type CommandDialogRootProps = Omit<BaseProps, "defaultOpen" | "onOpenChange" | "open"> & {
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails: CommandDialogChangeEventDetails) => void;
    open?: boolean;
  };

  type PrimitiveProps = Omit<CommandDialogRootProps, "onOpenChange"> & {
    onOpenChange?: (open: boolean) => void;
  };
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";
  import type { Component } from "svelte";
  import { untrack } from "svelte";
  import {
    createSelectionChangeContext,
    setSelectionChangeContext,
  } from "@/selection-change-context.js";

  let {
    children,
    defaultOpen = false,
    onOpenChange,
    open = $bindable(),
    ...props
  }: CommandDialogRootProps = $props();

  const openControlled = untrack(() => open !== undefined);
  let internalOpen = $state(untrack(() => defaultOpen));
  let pendingOpen: { canceled: boolean; value: boolean } | undefined;
  const currentOpen = $derived(openControlled ? (open as boolean) : internalOpen);
  const change = createSelectionChangeContext();
  setSelectionChangeContext(change);
  const DialogRoot = DialogPrimitive.Root as unknown as Component<PrimitiveProps, object, "open">;

  function getOpen(): boolean {
    return currentOpen;
  }

  function setOpen(next: boolean): void {
    if (pendingOpen?.value === next) {
      const { canceled } = pendingOpen;
      pendingOpen = undefined;
      if (canceled) return;
    }
    if (!openControlled) internalOpen = next;
    open = next;
  }

  function handleOpenChange(next: boolean): void {
    const details = change.details();
    onOpenChange?.(next, details);
    pendingOpen = { canceled: details.isCanceled, value: next };
  }
</script>

<DialogRoot bind:open={getOpen, setOpen} onOpenChange={handleOpenChange} {...props}>
  {#snippet children(state)}
    {@render children?.(state)}
  {/snippet}
</DialogRoot>
