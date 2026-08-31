<script lang="ts">
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { ContextMenu as P } from "@shardsui/svelte/context-menu";
  import { cn } from "@/utils.js";
  import type { ContextMenuRadioItemProps } from "./context-menu.types.js";

  const itemClass =
    "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[.75rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";
  let {
    children: child,
    class: className,
    ref = $bindable(null),
    ...props
  }: ContextMenuRadioItemProps = $props();
</script>

<P.RadioItem
  bind:ref
  class={cn(itemClass, className)}
  data-slot="context-menu-radio-item"
  {...props}
  >{#snippet children(state)}
    <P.RadioItemIndicator class="col-start-1 -ms-0.5"
      ><HugeiconsIcon aria-hidden="true" icon={Tick02Icon} strokeWidth={2} /></P.RadioItemIndicator
    ><span class="col-start-2">{@render child?.(state)}</span>
  {/snippet}</P.RadioItem
>
