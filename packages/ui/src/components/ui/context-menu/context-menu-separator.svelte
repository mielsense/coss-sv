<script module lang="ts">
import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ContextMenuSeparatorProps = ComponentProps<typeof ShardsContextMenu.Separator>;
</script>
<script lang="ts">
import { ContextMenu as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: ContextMenuSeparatorProps = $props();
</script>
<P.Separator
  bind:ref
  class={cn("mx-2 my-1 h-px bg-border", className)}
  data-slot="context-menu-separator"
  {...props}
/>
