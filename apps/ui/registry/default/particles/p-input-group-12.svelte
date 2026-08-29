<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "label", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-12",
    interactive: true,
    responsive: false,
    title: "Input group with inner label",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Label, Popover } from "@coss-sv/ui";
  import { InformationCircleIcon } from "@hugeicons/core-free-icons";
</script>

<InputGroup.Root
  ><InputGroup.Input id="email-1" placeholder="team@coss.com" type="email" />
  <InputGroup.Addon align="block-start"
    ><Label class="text-foreground" for="email-1">Email</Label><Popover.Root
      ><Popover.Trigger
        class={buttonVariants({ size: "icon-xs", variant: "ghost", class: "-m-1 ml-auto" })}
        openOnHover
        ><HugeiconsIcon
          aria-hidden="true"
          icon={InformationCircleIcon}
          strokeWidth={2}
        /></Popover.Trigger
      ><Popover.Popup side="top" tooltipStyle
        ><p>We'll use this to send you notifications</p></Popover.Popup
      ></Popover.Root
    ></InputGroup.Addon
  ></InputGroup.Root
>
