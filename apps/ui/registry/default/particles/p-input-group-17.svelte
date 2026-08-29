<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "menu", "tooltip"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
    id: "p-input-group-17",
    interactive: true,
    responsive: false,
    title: "Input group with textarea",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Menu, Tooltip } from "@coss-sv/ui";
  import { Add01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
</script>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Ask, Search or Chat…" />
  <InputGroup.Addon align="block-end">
    <Menu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger as="div" class="inline-flex">
          <Menu.Trigger
            aria-label="Add files"
            class={buttonVariants({ size: "icon-sm", variant: "ghost", class: "rounded-full" })}
          >
            <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
          </Menu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Popup>Add files and more</Tooltip.Popup>
      </Tooltip.Root>
      <Menu.Popup align="start">
        <Menu.Item>Add photos &amp; files</Menu.Item>
        <Menu.Item>Create image</Menu.Item>
        <Menu.Item>Thinking</Menu.Item>
        <Menu.Item>Deep research</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
    <InputGroup.Text class="ml-auto">78% used</InputGroup.Text>
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="Send"
        class={buttonVariants({ size: "icon-sm", variant: "default", class: "rounded-full" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={ArrowUp01Icon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup>Send</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
