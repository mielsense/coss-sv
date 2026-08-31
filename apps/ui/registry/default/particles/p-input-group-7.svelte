<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-7",
    interactive: true,
    responsive: false,
    title: "Input group with end tooltip",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Popover } from "@coss-sv/ui";
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
</script>

<InputGroup.Root>
  <InputGroup.Input aria-label="Password" placeholder="Password" type="password" />
  <InputGroup.Addon align="inline-end">
    <Popover.Root>
      <Popover.Trigger
        aria-label="Password requirements"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
        openOnHover
      >
        <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
      </Popover.Trigger>
      <Popover.Popup side="top" tooltipStyle><p>Min. 8 characters</p></Popover.Popup>
    </Popover.Root>
  </InputGroup.Addon>
</InputGroup.Root>
