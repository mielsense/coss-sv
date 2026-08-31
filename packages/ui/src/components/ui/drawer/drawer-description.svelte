<script module lang="ts">
  import type { Dialog as ShardsP } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type DrawerDescriptionProps = ComponentProps<typeof ShardsP.Description>;
</script>

<script lang="ts">
  import { Dialog as P } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: DrawerDescriptionProps = $props();
</script>

<P.Description
  bind:ref
  class={cn("text-muted-foreground text-sm", className)}
  data-slot="drawer-description"
  {...props}
/>
