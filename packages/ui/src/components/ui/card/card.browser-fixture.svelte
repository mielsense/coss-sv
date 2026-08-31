<script lang="ts">
  import * as Card from "./index.js";

  let clicks = $state(0);
  let ref = $state<HTMLElement | null>(null);
</script>

<Card.Root as="article" bind:ref data-testid="card" onclick={() => (clicks += 1)}>
  <Card.Panel>Project details</Card.Panel>
</Card.Root>
<output data-testid="state">{clicks}:{ref?.tagName ?? "missing"}</output>
