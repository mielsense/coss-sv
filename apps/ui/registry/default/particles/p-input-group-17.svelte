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
  import { Button, buttonVariants, HugeiconsIcon, InputGroup, Menu, Tooltip } from "@coss-sv/ui";
  import { Add01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";

  const uid = $props.id();
  const addFilesTooltip = Tooltip.TooltipCreateHandle();
  const sendTooltip = Tooltip.TooltipCreateHandle();
  const addFilesId = `${uid}-add-files`;
  const addFilesTooltipId = `${uid}-add-files-tooltip`;
  const sendId = `${uid}-send`;
  const sendTooltipId = `${uid}-send-tooltip`;
</script>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Ask, Search or Chat…" />
  <InputGroup.Addon align="block-end">
    <Menu.Root>
      <Tooltip.Root handle={addFilesTooltip}>
        <Menu.Trigger
          {@attach Tooltip.createTriggerAttachment(addFilesTooltip, () => ({
            ariaDescribedBy: addFilesTooltipId,
            id: addFilesId,
          }))}
          aria-describedby={addFilesTooltipId}
          aria-label="Add files"
          class={buttonVariants({ size: "icon-sm", variant: "ghost", class: "rounded-full" })}
          id={addFilesId}
        >
          <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
        </Menu.Trigger>
        <Tooltip.Popup id={addFilesTooltipId}>Add files and more</Tooltip.Popup>
      </Tooltip.Root>
      <Menu.Popup align="start">
        <Menu.Item>Add photos &amp; files</Menu.Item>
        <Menu.Item>Create image</Menu.Item>
        <Menu.Item>Thinking</Menu.Item>
        <Menu.Item>Deep research</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
    <InputGroup.Text class="ml-auto">78% used</InputGroup.Text>
    <Tooltip.Root handle={sendTooltip}>
      <Button
        {@attach Tooltip.createTriggerAttachment(sendTooltip, () => ({
          ariaDescribedBy: sendTooltipId,
          id: sendId,
        }))}
        aria-describedby={sendTooltipId}
        aria-label="Send"
        class="rounded-full"
        id={sendId}
        size="icon-sm"
      >
        <HugeiconsIcon aria-hidden="true" icon={ArrowUp01Icon} strokeWidth={2} />
      </Button>
      <Tooltip.Popup id={sendTooltipId}>Send</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
