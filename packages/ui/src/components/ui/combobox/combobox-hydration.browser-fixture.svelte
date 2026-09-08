<script lang="ts">
  import * as C from "./index.js";

  let value = $state<string | null>("Apple");
</script>

<button type="button" data-testid="hydrated-external" onclick={() => (value = "Banana")}
  >Change selection</button
>
<C.Root bind:value items={["Apple", "Banana"]}>
  <C.Input aria-label="Hydrated selection" />
</C.Root>
<output data-testid="hydrated-value">{value}</output>
