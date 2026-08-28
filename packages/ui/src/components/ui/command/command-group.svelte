<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type CommandGroupProps = ComponentProps<typeof ShardsAutocomplete.Group>;
</script>

<script lang="ts">
import { Autocomplete as A } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: CommandGroupProps = $props();
</script>

<A.Group
  bind:ref
  class={cn("[[role=group]+&]:mt-1.5", className)}
  data-slot="command-group"
  {...props}
/>
