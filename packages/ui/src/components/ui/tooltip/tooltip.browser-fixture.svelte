<script lang="ts">
import * as Tooltip from "./index.js";
let portalTarget = $state<HTMLElement | null>(null);
</script>
<div bind:this={portalTarget} data-testid="tooltip-portal"></div>
<Tooltip.Provider delay={0} timeout={400}>
  <Tooltip.Root>
    <Tooltip.Trigger data-testid="tip-one">First action</Tooltip.Trigger>
    <Tooltip.Popup portalProps={{ container: portalTarget }}>First hint</Tooltip.Popup>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger data-testid="tip-two">Second action</Tooltip.Trigger>
    <Tooltip.Popup side="right"><button type="button">Second hint</button></Tooltip.Popup>
  </Tooltip.Root>
</Tooltip.Provider>

<Tooltip.Root disableHoverablePopup>
  <Tooltip.Trigger data-testid="noninteractive" delay={0}>No boundary</Tooltip.Trigger>
  <Tooltip.Popup>Noninteractive hint</Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root disabled>
  <Tooltip.Trigger data-testid="disabled-tip" delay={0}>Disabled action</Tooltip.Trigger>
  <Tooltip.Popup>Disabled hint</Tooltip.Popup>
</Tooltip.Root>
