<script module lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";
import type { Snippet } from "svelte";
export type SelectButtonProps = Omit<HTMLButtonAttributes, "children"> & {
  children?: Snippet;
  ref?: HTMLButtonElement | null;
  size?: "sm" | "default" | "lg";
};
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
import { selectTriggerClass, selectTriggerIconClassName } from "./select-trigger.svelte";
let {
  children,
  class: className,
  ref = $bindable(null),
  size = "default",
  type = "button",
  ...props
}: SelectButtonProps = $props();
</script>
<button
  bind:this={ref}
  class={cn(selectTriggerClass,"min-w-0",size==="lg"&&"min-h-10 sm:min-h-9",size==="sm"&&"min-h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:min-h-7",className)}
  data-slot="select-button"
  {type}
  {...props}
>
  <span class="flex-1 truncate in-data-placeholder:text-muted-foreground/72"
    >{@render children?.()}</span
  ><svg
    aria-hidden="true"
    class={selectTriggerIconClassName}
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
</button>
