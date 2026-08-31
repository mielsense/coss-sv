<script module lang="ts">
  import type { Accordion as ShardsAccordion } from "@shardsui/svelte/accordion";
  import type { ComponentProps } from "svelte";

  export type AccordionPanelProps = ComponentProps<typeof ShardsAccordion.Panel>;
</script>

<script lang="ts">
  import { Accordion as AccordionPrimitive } from "@shardsui/svelte/accordion";
  import { cn } from "@/utils.js";

  let {
    children: child,
    class: className,
    ref = $bindable(null),
    ...props
  }: AccordionPanelProps = $props();
</script>

<AccordionPrimitive.Panel
  bind:ref
  class="h-(--accordion-panel-height) overflow-hidden text-muted-foreground text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0"
  data-slot="accordion-panel"
  {...props}
>
  {#snippet children(state)}
    <div class={cn("pt-0 pb-4", className)}>{@render child?.(state)}</div>
  {/snippet}
</AccordionPrimitive.Panel>
