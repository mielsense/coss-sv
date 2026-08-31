<script module lang="ts">
  import type { Accordion as ShardsAccordion } from "@shardsui/svelte/accordion";
  import type { ComponentProps } from "svelte";

  export type AccordionHeaderProps = ComponentProps<typeof ShardsAccordion.Header>;
</script>

<script lang="ts">
  import { Accordion as AccordionPrimitive } from "@shardsui/svelte/accordion";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: AccordionHeaderProps = $props();
</script>

<AccordionPrimitive.Header bind:ref class={cn("flex", className)} {...props} />
