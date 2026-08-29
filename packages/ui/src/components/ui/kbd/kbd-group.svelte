<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type KbdGroupProps = HTMLAttributes<HTMLElement> & {
    children?: Snippet;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: KbdGroupProps = $props();
</script>

<kbd
  class={cn("inline-flex items-center gap-1", className)}
  data-slot="kbd-group"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</kbd>
