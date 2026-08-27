<script module lang="ts">
import type { Radio as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DrawerMenuRadioItemProps = ComponentProps<typeof ShardsP.Root> & { value: string };
</script>
<script lang="ts">
import { Radio as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  children: child,
  class: className,
  ref = $bindable(null),
  ...props
}: DrawerMenuRadioItemProps = $props();
</script>
<P.Root
  bind:ref
  class={cn("grid min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0 grid-cols-[1rem_1fr] items-center pe-4", className)}
  data-slot="drawer-menu-radio-item"
  {...props}
  >{#snippet children(state)}
    <P.Indicator class="col-start-1"
      ><svg
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M5.252 12.7 10.2 18.63 18.748 5.37"></path>
      </svg></P.Indicator
    ><span class="col-start-2">{@render child?.(state)}</span>
  {/snippet}</P.Root
>
