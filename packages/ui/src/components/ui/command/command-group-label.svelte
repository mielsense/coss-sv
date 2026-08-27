<script lang="ts">
import { Autocomplete as A } from "@shardsui/svelte";
let { ref = $bindable(null), ...props } = $props();
</script>
<A.GroupLabel
  bind:ref
  class="px-2 py-1.5 font-medium text-muted-foreground text-xs"
  data-slot="command-group-label"
  {...props}
/>
