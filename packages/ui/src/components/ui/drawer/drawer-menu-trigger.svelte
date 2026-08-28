<script module lang="ts">
import type { DrawerTriggerProps } from "./drawer-trigger.svelte";
export type DrawerMenuTriggerProps = DrawerTriggerProps;
</script>
<script lang="ts">
import { ChevronRightIcon } from "@hugeicons/core-free-icons";
import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
import { cn } from "$lib/utils.js";
import Trigger from "./drawer-trigger.svelte";

let {
  children: child,
  class: className,
  ref = $bindable(null),
  ...props
}: DrawerMenuTriggerProps = $props();
</script>
<Trigger
  bind:ref
  class={cn("flex min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground sm:min-h-8 sm:text-sm [&_svg:not(:last-child)]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className)}
  data-slot="drawer-menu-trigger"
  {...props}
  >{#snippet children(state)}
    {@render child?.(state)}
    <HugeiconsIcon
      aria-hidden="true"
      class="ms-auto -me-0.5 opacity-80"
      icon={ChevronRightIcon}
      strokeWidth={2}
    />
  {/snippet}</Trigger
>
