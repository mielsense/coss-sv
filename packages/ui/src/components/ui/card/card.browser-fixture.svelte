<script lang="ts">
import { Card, CardPanel } from "./index.js";

let clicks = $state(0);
let ref = $state<HTMLElement | null>(null);
</script>

<Card as="article" bind:ref data-testid="card" onclick={() => (clicks += 1)}>
  <CardPanel>Project details</CardPanel>
</Card>
<output data-testid="state">{clicks}:{ref?.tagName ?? "missing"}</output>
