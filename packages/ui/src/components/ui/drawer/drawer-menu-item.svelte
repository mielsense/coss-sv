<script module lang="ts">
import { cn } from "$lib/utils.js";
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export type DrawerMenuItemVariant = "default" | "destructive";
export type DrawerMenuItemProps = Omit<HTMLButtonAttributes, "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLButtonElement | null;
  variant?: DrawerMenuItemVariant;
};

export function drawerMenuItemVariants({
  class: className,
}: {
  class?: string;
  variant?: DrawerMenuItemVariant;
} = {}): string {
  return cn(
    "flex min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-64 data-[variant=destructive]:text-destructive-foreground sm:min-h-8 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0",
    className,
  );
}
</script>

<script lang="ts">
let {
  children,
  class: className,
  ref = $bindable(null),
  type = "button",
  variant = "default",
  ...props
}: DrawerMenuItemProps = $props();
const classes = $derived(
  drawerMenuItemVariants(className ? { class: className, variant } : { variant }),
);
</script>
<button
  bind:this={ref}
  class={classes}
  data-slot="drawer-menu-item"
  data-variant={variant}
  {type}
  {...props}
>
  {@render children?.()}
</button>
