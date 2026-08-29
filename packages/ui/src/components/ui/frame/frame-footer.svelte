<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type FrameFooterProps = HTMLAttributes<HTMLElement> & {
    children?: Snippet;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: FrameFooterProps = $props();
</script>

<footer
  class={cn("px-5 py-4", className)}
  data-slot="frame-panel-footer"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</footer>
