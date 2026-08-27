<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type MenuItemProps = ComponentProps<typeof ShardsMenu.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
</script>

<script lang="ts">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

const itemClass =
  "flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0";

let {
  class: className,
  inset,
  ref = $bindable(null),
  variant = "default",
  ...props
}: MenuItemProps = $props();
</script>

<MenuPrimitive.Item
  bind:ref
  class={cn(itemClass, className)}
  data-inset={inset}
  data-slot="menu-item"
  data-variant={variant}
  {...props}
/>
