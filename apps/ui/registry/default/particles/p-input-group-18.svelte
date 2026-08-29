<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["badge", "button", "input-group", "menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-18",
    interactive: true,
    responsive: false,
    title: "Input group with badge and menu",
  });
</script>

<script lang="ts">
  import { Badge, buttonVariants, HugeiconsIcon, InputGroup, Menu } from "@coss-sv/ui";
  import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
</script>

<InputGroup.Root>
  <InputGroup.Input defaultValue="hello@coss.com" placeholder="Enter email" type="email" />
  <InputGroup.Addon align="inline-end">
    <Badge variant="info">Primary</Badge>
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open menu"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={MoreHorizontalIcon} strokeWidth={2} />
      </Menu.Trigger>
      <Menu.Popup align="end" alignOffset={-4} sideOffset={8}>
        <Menu.Item disabled>Make Primary</Menu.Item>
        <Menu.Item variant="destructive">Delete</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
