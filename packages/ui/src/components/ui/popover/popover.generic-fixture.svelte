<script lang="ts">
import * as Popover from "./index.js";

const handle = Popover.PopoverCreateHandle<{ label: string }>();
let isOpen = $state(false);
let triggerId = $state<string | null>(null);
</script>

<Popover.Trigger {handle} payload={{ label: "Account" }}>Open account</Popover.Trigger>
<Popover.Root
  bind:open={isOpen}
  bind:triggerId
  defaultOpen
  {handle}
  onOpenChange={(next) => (isOpen = next)}
>
  {#snippet children({ payload })}
    <Popover.Popup>{payload?.label}</Popover.Popup>
  {/snippet}
</Popover.Root>
