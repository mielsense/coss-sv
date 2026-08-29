<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type CommandSeparatorProps = ComponentProps<typeof ShardsAutocomplete.Separator>;
</script>

<script lang="ts">
  import { Autocomplete as A } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  let { class: className, ref = $bindable(null), ...props }: CommandSeparatorProps = $props();
</script>

<A.Separator
  bind:ref
  class={cn("mx-2 h-px bg-border last:hidden my-2", className)}
  data-slot="command-separator"
  {...props}
/>
