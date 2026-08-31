<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarInsetProps = Omit<HTMLAttributes<HTMLElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: SidebarInsetProps = $props();
</script>

<main
  bind:this={ref}
  class={cn(
    "relative flex w-full flex-1 flex-col bg-background",
    "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm/5",
    className,
  )}
  data-slot="sidebar-inset"
  {...props}
>
  {@render children?.()}
</main>
