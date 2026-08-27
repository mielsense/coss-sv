<script lang="ts">
import { Progress } from "@coss-sv/ui";

let value = $state(20);
let probeValue = $state<number | null>(60);

$effect(() => {
  const interval = setInterval(() => {
    value = Math.min(100, Math.round(value + Math.random() * 25));
  }, 1000);
  return () => clearInterval(interval);
});
</script>

<div class="docs-preview-width" data-particle="p-progress-1">
  <Progress.Root {value} data-testid="parity-progress" />
</div>

<div class="review-probes docs-preview-width" data-review-probes="progress">
  <Progress.Root value={probeValue} data-testid="probe-progress">
    <div class="flex items-center justify-between gap-2">
      <Progress.Label data-testid="probe-progress-label">Export data</Progress.Label>
      <Progress.Value data-testid="probe-progress-value" />
    </div>
    <Progress.Track><Progress.Indicator data-testid="probe-progress-indicator" /></Progress.Track>
  </Progress.Root>
  <button type="button" data-testid="progress-complete" onclick={() => (probeValue = 120)}>
    Complete
  </button>
  <button type="button" data-testid="progress-indeterminate" onclick={() => (probeValue = null)}>
    Indeterminate
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
