<script lang="ts" generics="Payload = unknown">
  import { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte/preview-card";
  import type { PreviewCardTriggerProps } from "./preview-card.types.js";

  let {
    children: child,
    ref = $bindable(null),
    ...props
  }: PreviewCardTriggerProps<Payload> = $props();
</script>

<PreviewCardPrimitive.Trigger bind:ref data-slot="preview-card-trigger" {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</PreviewCardPrimitive.Trigger>
