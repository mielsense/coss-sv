<script module lang="ts">
  import type { Collapsible as ShardsCollapsible } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";

  export type CollapsibleRootProps = Omit<ComponentProps<typeof ShardsCollapsible.Root>, "open"> & {
    defaultOpen?: boolean;
    open?: boolean | undefined;
  };
</script>

<script lang="ts">
  import { Collapsible as CollapsiblePrimitive } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import CollapsibleProvider from "./collapsible-provider.svelte";

  let {
    children: child,
    defaultOpen,
    onOpenChange,
    open = $bindable(),
    ref = $bindable(null),
    ...props
  }: CollapsibleRootProps = $props();

  const initialOpen = untrack(() => defaultOpen ?? false);

  function getOpen(): boolean {
    return open ?? initialOpen;
  }

  function setOpen(next: boolean): void {
    onOpenChange?.(next);
    open = next;
  }
</script>

<CollapsiblePrimitive.Root bind:open={getOpen, setOpen} bind:ref data-slot="collapsible" {...props}>
  {#snippet children(state)}
    <CollapsibleProvider {setOpen} {state}>{@render child?.(state)}</CollapsibleProvider>
  {/snippet}
</CollapsiblePrimitive.Root>
