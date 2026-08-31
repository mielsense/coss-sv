<script module lang="ts">
  import type { Accordion as ShardsAccordion } from "@shardsui/svelte/accordion";
  import type { ComponentProps } from "svelte";

  export type AccordionTriggerProps = ComponentProps<typeof ShardsAccordion.Trigger>;
</script>

<script lang="ts">
  import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
  import { Accordion as AccordionPrimitive } from "@shardsui/svelte/accordion";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { cn } from "@/utils.js";

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
    <HugeiconsIcon
      aria-hidden="true"
      class="pointer-events-none size-4 shrink-0 translate-y-0.5 opacity-80 transition-transform duration-200 ease-in-out"
      data-slot="accordion-indicator"
      icon={ChevronDownIcon}
      strokeWidth={2}
    />
  {/snippet}
</AccordionPrimitive.Trigger>
