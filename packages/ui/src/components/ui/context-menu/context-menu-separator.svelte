<script lang="ts">
  import { ContextMenu as P } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  import type { ContextMenuSeparatorProps } from "./context-menu.types.js";

  let { class: className, ref = $bindable(null), ...props }: ContextMenuSeparatorProps = $props();
</script>

<P.Separator
  bind:ref
  class={cn("mx-2 my-1 h-px bg-border", className)}
  data-slot="context-menu-separator"
  {...props}
/>
