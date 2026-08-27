<script lang="ts">
import * as ToggleGroup from "../toggle-group/index.js";
import * as Tooltip from "./index.js";

let portalTarget = $state<HTMLElement | null>(null);
let grouped = $state<readonly string[]>(["bold"]);
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

<ToggleGroup.Root bind:value={grouped} multiple>
  <Tooltip.Root>
    <Tooltip.Trigger
      aria-pressed={grouped.includes("bold")}
      data-testid="grouped-tooltip-trigger"
      onclick={() =>
        (grouped = grouped.includes("bold")
          ? grouped.filter((value) => value !== "bold")
          : [...grouped, "bold"])}
      >Bold</Tooltip.Trigger
    >
    <Tooltip.Popup>Toggle bold</Tooltip.Popup>
  </Tooltip.Root>
</ToggleGroup.Root>
<output data-testid="grouped-tooltip-value">{grouped.join(",")}</output>
