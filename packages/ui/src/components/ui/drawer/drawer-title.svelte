<script module lang="ts">
  import type { Dialog as ShardsP } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type DrawerTitleProps = ComponentProps<typeof ShardsP.Title>;
</script>

<script lang="ts">
  import { Dialog as P } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: DrawerTitleProps = $props();
</script>

<P.Title
  bind:ref
  class={cn("font-heading font-semibold text-xl leading-none", className)}
  data-slot="drawer-title"
  {...props}
/>
