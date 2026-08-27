<script module lang="ts">
import type { Toolbar as ShardsToolbar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ToolbarSeparatorProps = ComponentProps<typeof ShardsToolbar.Separator>;
</script>
<script lang="ts">
import { Toolbar as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: ToolbarSeparatorProps = $props();
</script>
<P.Separator
  bind:ref
  class={cn("shrink-0 bg-border data-[orientation=horizontal]:my-0.5 data-[orientation=vertical]:my-1.5 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch", className)}
  data-slot="toolbar-separator"
  {...props}
/>
