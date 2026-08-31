<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type TableCaptionProps = Omit<SvelteHTMLElements["caption"], "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLTableCaptionElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: TableCaptionProps = $props();
</script>

<caption
  bind:this={ref}
  class={cn("in-data-[variant=card]:my-4 mt-4 text-muted-foreground text-sm", className)}
  data-slot="table-caption"
  {...props}
>
  {@render children?.()}
</caption>
