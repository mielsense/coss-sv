<script lang="ts">
  import { Meter } from "@coss-sv/ui";

  let probeValue = $state(25);
</script>

<div class="docs-preview-width" data-particle="p-meter-1">
  <Meter.Root value={75} data-testid="parity-meter">
    <div class="flex items-center justify-between gap-2">
      <Meter.Label data-testid="parity-meter-label">Storage usage</Meter.Label>
      <Meter.Value data-testid="parity-meter-value" />
    </div>
    <Meter.Track data-testid="parity-meter-track">
      <Meter.Indicator data-testid="parity-meter-indicator" />
    </Meter.Track>
  </Meter.Root>
</div>

<div class="review-probes docs-preview-width" data-review-probes="meter">
  <Meter.Root aria-label="Probe usage" value={probeValue} data-testid="probe-meter" />
  <button type="button" data-testid="meter-above-max" onclick={() => (probeValue = 120)}>
    Above maximum
  </button>
  <button type="button" data-testid="meter-below-min" onclick={() => (probeValue = -20)}>
    Below minimum
  </button>
</div>

<style>
  .docs-preview-width {
    width: min(16rem, 100%);
  }
  .review-probes {
    margin-top: 2rem;
  }
</style>
