<script module lang="ts">
  import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte/context-menu";
  import type { ComponentProps } from "svelte";
  export type ContextMenuGroupLabelProps = ComponentProps<typeof ShardsContextMenu.GroupLabel> & {
    inset?: boolean;
  };
</script>

<script lang="ts">
  import { ContextMenu as P } from "@shardsui/svelte/context-menu";
  import { cn } from "@/utils.js";

  let {
    class: className,
    inset,
    ref = $bindable(null),
    ...props
  }: ContextMenuGroupLabelProps = $props();
</script>

<P.GroupLabel
  bind:ref
  class={cn(
    "px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:ps-9 sm:data-inset:ps-8",
    className,
  )}
  data-inset={inset}
  data-slot="context-menu-label"
  {...props}
/>
