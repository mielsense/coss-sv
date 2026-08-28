<script module lang="ts">
import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ContextMenuSubTriggerProps = ComponentProps<typeof ShardsContextMenu.SubmenuTrigger> & {
  inset?: boolean;
};
</script>
<script lang="ts">
import { ChevronRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { ContextMenu as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import { getContextMenuIdContext } from "./id-context.svelte.js";

const triggerClass =
  "flex min-h-8 items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-popup-open:bg-accent data-inset:ps-8 data-highlighted:text-accent-foreground data-popup-open:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not(:last-child)]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none";
let {
  "aria-controls": ariaControls,
  children: child,
  class: className,
  inset,
  ref = $bindable(null),
  ...props
}: ContextMenuSubTriggerProps = $props();
const menuIds = getContextMenuIdContext();
const resolvedControls = $derived(ariaControls ?? (menuIds.open ? menuIds.popupId : undefined));
</script>
<P.SubmenuTrigger
  aria-controls={resolvedControls}
  bind:ref
  class={cn(triggerClass, className)}
  data-inset={inset}
  data-slot="context-menu-sub-trigger"
  {...props}
  >{#snippet children(state)}
    {@render child?.(state)}
    <HugeiconsIcon
      aria-hidden="true"
      class="ms-auto -me-0.5 opacity-80"
      icon={ChevronRightIcon}
      strokeWidth={2}
    />
  {/snippet}</P.SubmenuTrigger
>
