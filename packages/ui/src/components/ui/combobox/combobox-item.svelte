<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxItemProps = ComponentProps<typeof ShardsCombobox.Item>;
</script>

<script lang="ts">
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { getSelectionChangeContext } from "@/selection-change-context.js";
  import { cn } from "@/utils.js";

  let {
    children: child,
    class: className,
    onclick,
    ref = $bindable(null),
    ...props
  }: ComboboxItemProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(event: Parameters<NonNullable<ComboboxItemProps["onclick"]>>[0]): void {
    change?.prepare("item-press", event);
    onclick?.(event);
  }
</script>

<C.Item
  bind:ref
  class={cn(
    "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    className,
  )}
  data-slot="combobox-item"
  onclick={handleClick}
  {...props}
  >{#snippet children(state)}
    <C.ItemIndicator class="col-start-1"
      ><HugeiconsIcon aria-hidden="true" icon={Tick02Icon} strokeWidth={2} /></C.ItemIndicator
    >
    <div class="col-start-2">{@render child?.(state)}</div>
  {/snippet}</C.Item
>
