<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type FrameHeaderProps = HTMLAttributes<HTMLElement> & {
    children?: Snippet;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: FrameHeaderProps = $props();
</script>

<header
  class={cn("flex flex-col px-5 py-4", className)}
  data-slot="frame-panel-header"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</header>
