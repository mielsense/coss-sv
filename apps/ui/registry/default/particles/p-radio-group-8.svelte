<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["radio-group", "segmented-control"],
    id: "p-radio-group-8",
    interactive: true,
    responsive: true,
    title: "Segmented control built with a radio group",
  });
</script>

<script lang="ts">
  import { RadioGroup, cn } from "@coss-sv/ui";
  import {
    segmentedControlItemVariants,
    segmentedControlRootClassName,
  } from "@coss-sv/ui/lib/segmented-control";

  const itemClassName = cn(segmentedControlItemVariants({ state: "checked" }), "grow");
</script>

<RadioGroup.RadioGroupPrimitive
  aria-label="Billing period"
  class={segmentedControlRootClassName}
  value="monthly"
>
  <RadioGroup.RadioPrimitive.Root class={itemClassName} value="monthly"
    >Monthly</RadioGroup.RadioPrimitive.Root
  >
  <RadioGroup.RadioPrimitive.Root class={itemClassName} value="yearly"
    >Yearly</RadioGroup.RadioPrimitive.Root
  >
</RadioGroup.RadioGroupPrimitive>
