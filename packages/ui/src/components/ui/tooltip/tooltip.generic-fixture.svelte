<script lang="ts">
  import * as Tooltip from "./index.js";

  const handle = Tooltip.TooltipCreateHandle<{ label: string }>();
  let isOpen = $state(false);
  let triggerId = $state<string | null>(null);
</script>

<Tooltip.Trigger {handle} payload={{ label: "Save" }}>Save</Tooltip.Trigger>
<Tooltip.Root
  bind:open={isOpen}
  bind:triggerId
  defaultOpen
  {handle}
  onOpenChange={(next) => (isOpen = next)}
>
  {#snippet children({ payload })}
    <Tooltip.Popup>{payload?.label}</Tooltip.Popup>
  {/snippet}
</Tooltip.Root>
