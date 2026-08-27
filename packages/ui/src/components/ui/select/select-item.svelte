<script module lang="ts">
import type { Select as ShardsSelect } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SelectItemProps = ComponentProps<typeof ShardsSelect.Item>;
</script>
<script lang="ts">
import { Select as S } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  children: child,
  class: className,
  ref = $bindable(null),
  ...props
}: SelectItemProps = $props();
</script>
<S.Item
  bind:ref
  class={cn("grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",className)}
  data-slot="select-item"
  {...props}
  >{#snippet children(state)}
    <S.ItemIndicator class="col-start-1"
      ><svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
      </svg></S.ItemIndicator
    >
    <div class="col-start-2 min-w-0">{@render child?.(state)}</div>
  {/snippet}</S.Item
>
