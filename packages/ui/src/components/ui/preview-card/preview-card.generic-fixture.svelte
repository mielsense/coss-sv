<script lang="ts">
import * as PreviewCard from "./index.js";

const handle = PreviewCard.PreviewCardCreateHandle<{ label: string }>();
let isOpen = $state(false);
let triggerId = $state<string | null>(null);
</script>

<PreviewCard.Trigger {handle} payload={{ label: "COSS" }}>Preview COSS</PreviewCard.Trigger>
<PreviewCard.Root
  bind:open={isOpen}
  bind:triggerId
  defaultOpen
  {handle}
  onOpenChange={(next) => (isOpen = next)}
>
  {#snippet children({ payload })}
    <PreviewCard.Popup>{payload?.label}</PreviewCard.Popup>
  {/snippet}
</PreviewCard.Root>
