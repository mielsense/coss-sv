<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type MenuGroupLabelProps = ComponentProps<typeof ShardsMenu.GroupLabel> & {
  inset?: boolean;
};
</script>

<script lang="ts">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, inset, ref = $bindable(null), ...props }: MenuGroupLabelProps = $props();
</script>

<MenuPrimitive.GroupLabel
  bind:ref
  class={cn("px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:ps-9 sm:data-inset:ps-8", className)}
  data-inset={inset}
  data-slot="menu-label"
  {...props}
/>
