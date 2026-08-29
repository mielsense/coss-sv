<script lang="ts">
  import * as Progress from "./index.js";

  let value = $state<number | null>(20);
  let rootRef = $state<HTMLElement | null>(null);
</script>

<Progress.Root bind:ref={rootRef} {value} data-testid="progress">
  <Progress.Label data-testid="progress-label">Upload</Progress.Label>
  <Progress.Value data-testid="progress-value" />
  <Progress.Track data-testid="progress-track"
    ><Progress.Indicator data-testid="progress-indicator" /></Progress.Track
  >
</Progress.Root>
<button type="button" data-testid="complete" onclick={() => (value = 120)}>Complete</button>
<button type="button" data-testid="indeterminate" onclick={() => (value = null)}>
  Indeterminate
</button>
<output data-testid="progress-ref">{rootRef?.tagName ?? "missing"}</output>
