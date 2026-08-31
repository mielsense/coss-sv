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
  class={cn("flex flex-col gap-2.5 text-muted-foreground [svg~&]:col-start-2", className)}
  data-slot="alert-description"
  {...props}
>
  {@render children?.()}
</div>
