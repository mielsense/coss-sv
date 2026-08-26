<script lang="ts">
import ContractChild from "./ContractChild.svelte";
import { setContractLabel } from "./contract-context.js";

setContractLabel("Increment contract");
let value = $state(0);
</script>

<ContractChild bind:value>
  {#snippet children(current: number)}
    <output aria-live="polite">Bound value: {current}</output>
  {/snippet}
</ContractChild>
<p data-parent-value={value}>Parent value: {value}</p>
