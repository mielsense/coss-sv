<script module lang="ts">
import type { PreviewCard as ShardsPreviewCard } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type PreviewCardRootProps = Omit<ComponentProps<typeof ShardsPreviewCard.Root>, "open"> & {
  defaultOpen?: boolean;
  open?: boolean | undefined;
};
</script>
<script lang="ts">
import { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
let {
  children: child,
  defaultOpen,
  onOpenChange,
  open = $bindable(),
  triggerId = $bindable(null),
  ...props
}: PreviewCardRootProps = $props();
const initialOpen = untrack(() => defaultOpen ?? false);
const getOpen = () => open ?? initialOpen;
function setOpen(next: boolean) {
  onOpenChange?.(next);
  open = next;
}
</script>
<PreviewCardPrimitive.Root bind:open={getOpen, setOpen} bind:triggerId {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</PreviewCardPrimitive.Root>
