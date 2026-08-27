<script lang="ts">
import { Skeleton } from "./index.js";

let clicks = $state(0);
let ref = $state<HTMLDivElement | null>(null);
</script>

<Skeleton bind:ref data-testid="skeleton" onclick={() => (clicks += 1)}>
  <span data-testid="skeleton-content">Loading profile</span>
</Skeleton>
<output data-testid="skeleton-state">{clicks}:{ref?.tagName ?? "missing"}</output>
