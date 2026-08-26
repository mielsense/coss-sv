<script lang="ts">
import type { Snippet } from "svelte";
import { getContractLabel } from "./contract-context.js";

interface Props {
  value?: number;
  children: Snippet<[number]>;
}

let { value = $bindable(0), children }: Props = $props();
const label = getContractLabel();
</script>

<button type="button" onclick={() => (value += 1)}>{label}</button>
{@render children(value)}
