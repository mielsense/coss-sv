<script lang="ts">
  import { Badge } from "./index.js";

  let clicks = $state(0);
  let ref = $state<HTMLElement | null>(null);
</script>

<Badge as="button" bind:ref data-testid="badge" onclick={() => (clicks += 1)} type="button">
  Selectable
</Badge>
<output data-testid="state">{clicks}:{ref?.tagName ?? "missing"}</output>
