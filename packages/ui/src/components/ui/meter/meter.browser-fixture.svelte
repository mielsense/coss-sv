<script lang="ts">
import * as Meter from "./index.js";

let value = $state(75);
let rootRef = $state<HTMLElement | null>(null);
let indicatorRef = $state<HTMLElement | null>(null);
</script>

<Meter.Root bind:ref={rootRef} {value} data-testid="meter">
  <div>
    <Meter.Label data-testid="meter-label">Storage usage</Meter.Label>
    <Meter.Value data-testid="meter-value" />
  </div>
  <Meter.Track data-testid="meter-track">
    <Meter.Indicator bind:ref={indicatorRef} data-testid="meter-indicator" />
  </Meter.Track>
</Meter.Root>
<button type="button" data-testid="meter-update" onclick={() => (value = 120)}>Update</button>
<Meter.Root aria-label="Custom range" max={1000} min={500} value={700}>
  <Meter.Value data-testid="custom-meter-value">
    {#snippet children(formattedValue, rawValue)}
      {formattedValue}:{rawValue}
    {/snippet}
  </Meter.Value>
  <Meter.Track><Meter.Indicator data-testid="custom-meter-indicator" /></Meter.Track>
</Meter.Root>
<output data-testid="meter-refs"
  >{rootRef?.tagName ?? "missing"}:{indicatorRef?.tagName ?? "missing"}</output
>
