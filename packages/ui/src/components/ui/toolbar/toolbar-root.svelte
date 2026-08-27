<script module lang="ts">
import type { Toolbar as ShardsToolbar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ToolbarRootProps = ComponentProps<typeof ShardsToolbar.Root>;
</script>

<script lang="ts">
import { Toolbar as ToolbarPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: ToolbarRootProps = $props();
</script>

<ToolbarPrimitive.Root
  bind:ref
  class={cn("relative flex gap-2 rounded-xl border bg-card not-dark:bg-clip-padding p-1 text-card-foreground", className)}
  data-slot="toolbar"
  {...props}
/>
