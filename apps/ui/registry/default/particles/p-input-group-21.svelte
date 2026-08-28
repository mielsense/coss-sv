<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "input-group", "tooltip"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-group-21",
  interactive: true,
  responsive: false,
  title: "Input group with start tooltip",
});
</script>
<script lang="ts">
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { buttonVariants, InputGroup, Tooltip } from "@coss-sv/ui";
</script>
<InputGroup.Root>
  <InputGroup.Addon>
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="More information"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup>Enter your username</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
  <InputGroup.Input aria-label="Username" placeholder="Username" type="text" />
</InputGroup.Root>
