<script module lang="ts">
import type { Toolbar as ShardsToolbar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ToolbarGroupProps = ComponentProps<typeof ShardsToolbar.Group>;
</script>
<script lang="ts">
import { Toolbar as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: ToolbarGroupProps = $props();
</script>
<P.Group
  bind:ref
  class={cn("flex items-center gap-1", className)}
  data-slot="toolbar-group"
  {...props}
/>
