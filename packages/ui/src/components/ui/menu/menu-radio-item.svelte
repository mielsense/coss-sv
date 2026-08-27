<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type MenuRadioItemProps = ComponentProps<typeof ShardsMenu.RadioItem>;
</script>

<script lang="ts">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

const itemClass =
  "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[.75rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

let {
  children: child,
  class: className,
  ref = $bindable(null),
  ...props
}: MenuRadioItemProps = $props();
</script>

<MenuPrimitive.RadioItem
  bind:ref
  class={cn(itemClass, className)}
  data-slot="menu-radio-item"
  {...props}
>
  {#snippet children(state)}
    <MenuPrimitive.RadioItemIndicator class="col-start-1 -ms-0.5">
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
      </svg>
    </MenuPrimitive.RadioItemIndicator>
    <span class="col-start-2">{@render child?.(state)}</span>
  {/snippet}
</MenuPrimitive.RadioItem>
