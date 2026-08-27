<script module lang="ts">
import type { Accordion as ShardsAccordion } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type AccordionTriggerProps = ComponentProps<typeof ShardsAccordion.Trigger>;
</script>

<script lang="ts">
import { Accordion as AccordionPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let {
  children: child,
  class: className,
  ref = $bindable(null),
  ...props
}: AccordionTriggerProps = $props();
</script>

<AccordionPrimitive.Trigger
  bind:ref
  class={cn(
    "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 data-panel-open:*:data-[slot=accordion-indicator]:rotate-180",
    className,
  )}
  data-slot="accordion-trigger"
  {...props}
>
  {#snippet children(state)}
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
      class="lucide lucide-chevron-down pointer-events-none size-4 shrink-0 translate-y-0.5 opacity-80 transition-transform duration-200 ease-in-out"
      aria-hidden="true"
      data-slot="accordion-indicator"
    >
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  {/snippet}
</AccordionPrimitive.Trigger>
