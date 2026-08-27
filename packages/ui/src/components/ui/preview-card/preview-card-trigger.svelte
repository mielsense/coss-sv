<script module lang="ts">
import type { PreviewCard as ShardsPreviewCard } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type PreviewCardTriggerProps = ComponentProps<typeof ShardsPreviewCard.Trigger>;
</script>
<script lang="ts">
import { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte";
let { children: child, ref = $bindable(null), ...props }: PreviewCardTriggerProps = $props();
</script>
<PreviewCardPrimitive.Trigger bind:ref data-slot="preview-card-trigger" {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</PreviewCardPrimitive.Trigger>
