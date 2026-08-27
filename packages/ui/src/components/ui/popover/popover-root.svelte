<script module lang="ts">
import type { Popover as ShardsPopover } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type PopoverRootProps = Omit<ComponentProps<typeof ShardsPopover.Root>, "open"> & {
  defaultOpen?: boolean;
  open?: boolean | undefined;
};
</script>

<script lang="ts">
import { Popover as PopoverPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";

let {
  children: child,
  defaultOpen,
  onOpenChange,
  open = $bindable(),
  triggerId = $bindable(null),
  ...props
}: PopoverRootProps = $props();

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
