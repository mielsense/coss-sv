<script module lang="ts">
import type { DrawerTriggerProps } from "./drawer-trigger.svelte";
export type DrawerMenuTriggerProps = DrawerTriggerProps;
</script>
<script lang="ts">
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-right ms-auto -me-0.5 opacity-80"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  {/snippet}</Trigger
>
