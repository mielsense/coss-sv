<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type FrameDescriptionProps = HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: FrameDescriptionProps = $props();
</script>

<div
  class={cn("text-muted-foreground text-sm", className)}
  data-slot="frame-panel-description"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</div>
