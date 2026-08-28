<script lang="ts">
import Spinner from "./spinner.svelte";

let clicks = $state(0);
let ref = $state<SVGSVGElement | null>(null);
</script>
<Spinner bind:ref data-testid="spinner" onclick={() => (clicks += 1)} />
<Spinner aria-label="Saving" data-testid="custom-spinner" height={18} role="img" width={18} />
<Spinner
  absoluteStrokeWidth
  data-testid="hugeicons-props-spinner"
  height={20}
  size={48}
  strokeWidth={4}
  width={18}
/>
<button type="button" data-testid="after-spinner">After</button>
<output data-testid="spinner-state">{clicks}:{ref?.tagName ?? "missing"}</output>
