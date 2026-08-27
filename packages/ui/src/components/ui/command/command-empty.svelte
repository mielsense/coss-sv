<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type CommandEmptyProps = ComponentProps<typeof ShardsAutocomplete.Empty>;
</script>
<script lang="ts">
import { Autocomplete as A } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: CommandEmptyProps = $props();
</script>
<A.Empty
  bind:ref
  class={cn("not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm not-empty:py-6",className)}
  data-slot="command-empty"
  {...props}
/>
