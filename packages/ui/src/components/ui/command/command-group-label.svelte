<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type CommandGroupLabelProps = ComponentProps<typeof ShardsAutocomplete.GroupLabel>;
</script>

<script lang="ts">
import { Autocomplete as A } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: CommandGroupLabelProps = $props();
</script>

<A.GroupLabel
  bind:ref
  class={cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className)}
  data-slot="command-group-label"
  {...props}
/>
