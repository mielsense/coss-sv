<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type MenuCheckboxItemProps = Omit<
  ComponentProps<typeof ShardsMenu.CheckboxItem>,
  "checked"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  variant?: "default" | "switch";
};
</script>

<script lang="ts">
import { Tick02Icon } from "@hugeicons/core-free-icons";
import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { cn } from "$lib/utils.js";

const itemClass =
  "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default items-center gap-2 rounded-sm py-1 ps-2 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

let {
  checked = $bindable(),
  children: child,
  class: className,
  defaultChecked,
  ref = $bindable(null),
  variant = "default",
  ...props
}: MenuCheckboxItemProps = $props();

const initialChecked = untrack(() => defaultChecked ?? false);

function getChecked(): boolean {
  return checked ?? initialChecked;
}

function setChecked(next: boolean): void {
  checked = next;
}
</script>

<MenuPrimitive.CheckboxItem
  bind:checked={getChecked, setChecked}
  bind:ref
  class={cn(
    itemClass,
    variant === "switch" ? "grid-cols-[1fr_auto] gap-4 pe-1.5" : "grid-cols-[.75rem_1fr] pe-4",
    className,
  )}
  data-slot="menu-checkbox-item"
  {...props}
>
  {#snippet children(state)}
    {#if variant === "switch"}
      <span class="col-start-1">{@render child?.(state)}</span>
      <MenuPrimitive.CheckboxItemIndicator
        class="inset-shadow-[0_1px_--theme(--color-black/4%)] inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow] duration-200 [--thumb-size:--spacing(4)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64 sm:[--thumb-size:--spacing(3)]"
        keepMounted
      >
        <span
          class="pointer-events-none block aspect-square h-full in-[[data-slot=menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%] origin-left in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)] in-[[data-slot=menu-checkbox-item]:active]:not-data-disabled:scale-x-110 in-[[data-slot=menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)] rounded-(--thumb-size) bg-background shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s]"
        ></span>
      </MenuPrimitive.CheckboxItemIndicator>
    {:else}
      <MenuPrimitive.CheckboxItemIndicator class="col-start-1 -ms-0.5">
        <HugeiconsIcon aria-hidden="true" icon={Tick02Icon} strokeWidth={2} />
      </MenuPrimitive.CheckboxItemIndicator>
      <span class="col-start-2">{@render child?.(state)}</span>
    {/if}
  {/snippet}
</MenuPrimitive.CheckboxItem>
