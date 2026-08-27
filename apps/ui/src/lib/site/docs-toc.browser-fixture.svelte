<script lang="ts">
import DocsToc from "./DocsToc.svelte";

let replacement = $state(false);
</script>

<button type="button" onclick={() => (replacement = !replacement)}>Replace content</button>
<article class="docs-content">
  {#if replacement}
    <h2 id="replacement-heading">Replacement heading</h2>
    <h3 id="replacement-detail">Replacement detail</h3>
  {:else}
    <h2 id="initial-heading">Initial heading</h2>
  {/if}
</article>
<DocsToc />
