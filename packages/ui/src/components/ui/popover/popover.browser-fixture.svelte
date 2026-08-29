<script lang="ts">
  import * as Popover from "./index.js";

  let open = $state(false);
  let changes = $state(0);
  let portalTarget = $state<HTMLElement | null>(null);
  let anchor = $state<HTMLElement | null>(null);
</script>

<div bind:this={portalTarget} data-testid="portal-target"></div>
<span bind:this={anchor} data-testid="custom-anchor">Anchor</span>
<Popover.Root bind:open onOpenChange={() => changes++}>
  <Popover.Trigger data-testid="trigger">Open details</Popover.Trigger>
  <Popover.Popup {anchor} portalProps={{ container: portalTarget }}>
    <Popover.Title>Account details</Popover.Title>
    <Popover.Description>Update your profile.</Popover.Description>
    <input aria-label="Name" />
    <Popover.Close>Done</Popover.Close>
  </Popover.Popup>
</Popover.Root>
<output data-testid="state">{open}:{changes}</output>

<Popover.Root>
  <Popover.Trigger closeDelay={30} data-testid="hover-trigger" delay={0} openOnHover
    >Hover details</Popover.Trigger
  >
  <Popover.Popup data-testid="hover-popup" tooltipStyle
    ><button type="button">Interactive action</button></Popover.Popup
  >
</Popover.Root>
