<script lang="ts" generics="Payload = unknown">
  import { Popover as PopoverPrimitive } from "@shardsui/svelte/popover";
  import { untrack } from "svelte";
  import type { PopoverRootProps } from "./popover.types.js";

  let {
    children: child,
    defaultOpen,
    onOpenChange,
    open = $bindable(),
    triggerId = $bindable(null),
    ...props
  }: PopoverRootProps<Payload> = $props();

  const initialOpen = untrack(() => defaultOpen ?? false);
  const getOpen = () => open ?? initialOpen;
  function setOpen(next: boolean): void {
    onOpenChange?.(next);
    open = next;
  }
</script>

<PopoverPrimitive.Root bind:open={getOpen, setOpen} bind:triggerId {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</PopoverPrimitive.Root>
