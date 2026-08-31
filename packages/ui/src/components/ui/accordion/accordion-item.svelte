<script module lang="ts">
  import type { Accordion as ShardsAccordion } from "@shardsui/svelte/accordion";
  import type { ComponentProps } from "svelte";

  export type AccordionItemProps = ComponentProps<typeof ShardsAccordion.Item>;
</script>

<script lang="ts">
  import { Accordion as AccordionPrimitive } from "@shardsui/svelte/accordion";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: AccordionItemProps = $props();
</script>

<AccordionPrimitive.Item
  bind:ref
  class={cn("border-b last:border-b-0", className)}
  data-slot="accordion-item"
  {...props}
/>
