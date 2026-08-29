<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "input-group", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-8",
    interactive: true,
    responsive: false,
    title: "Input with start text and end tooltip",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Popover } from "@coss-sv/ui";
  import { InformationCircleIcon } from "@hugeicons/core-free-icons";
</script>

<InputGroup.Root>
  <InputGroup.Input
    aria-label="Set your URL"
    class="*:[input]:ps-0!"
    placeholder="coss.com"
    type="text"
  />
  <InputGroup.Addon>https://</InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <Popover.Root>
      <Popover.Trigger
        aria-label="More info"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
        openOnHover
      >
        <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
      </Popover.Trigger>
      <Popover.Popup side="top" tooltipStyle><p>The URL of your website</p></Popover.Popup>
    </Popover.Root>
  </InputGroup.Addon>
</InputGroup.Root>
