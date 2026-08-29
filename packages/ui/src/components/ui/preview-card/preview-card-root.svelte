<script lang="ts" generics="Payload = unknown">
  import { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import type { PreviewCardRootProps } from "./preview-card.types.js";

  let {
    children: child,
    defaultOpen,
    onOpenChange,
    open = $bindable(),
    triggerId = $bindable(null),
    ...props
  }: PreviewCardRootProps<Payload> = $props();
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
