<script lang="ts">
import { EmptyMedia } from "./index.js";

let clicks = $state(0);
let ref = $state<HTMLDivElement | null>(null);
</script>

<EmptyMedia bind:ref data-testid="media" onclick={() => (clicks += 1)} variant="icon">
  <span data-testid="content">icon</span>
</EmptyMedia>
<output data-testid="state">{clicks}:{ref?.tagName ?? "missing"}</output>
