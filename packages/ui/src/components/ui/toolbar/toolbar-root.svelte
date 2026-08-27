<script lang="ts">
import { Toolbar as ToolbarPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import type { ToolbarRootProps } from "./toolbar.types.js";

let { class: className, ref = $bindable(null), ...props }: ToolbarRootProps = $props();
</script>

<ToolbarPrimitive.Root
  bind:ref
  class={cn("relative flex gap-2 rounded-xl border bg-card not-dark:bg-clip-padding p-1 text-card-foreground", className)}
  data-slot="toolbar"
  {...props}
/>
