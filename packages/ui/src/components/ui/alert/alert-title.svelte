<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "@/utils.js";

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  };

  let { children, class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<div
  bind:this={ref}
  class={cn("font-medium [svg~&]:col-start-2", className)}
  data-slot="alert-title"
  {...props}
>
  {@render children?.()}
</div>
