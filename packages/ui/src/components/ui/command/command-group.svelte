<script lang="ts">
import { Autocomplete as A } from "@shardsui/svelte";
let { ref = $bindable(null), ...props } = $props();
</script>
<A.Group bind:ref class="[[role=group]+&]:mt-1.5" data-slot="command-group" {...props} />
