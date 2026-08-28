<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "input-group", "tooltip"],
  id: "p-group-12",
  interactive: true,
  responsive: false,
  title: "Group with input group",
});
</script>
<script lang="ts">
import { Attachment01Icon, Mic01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, buttonVariants, Group, InputGroup, Tooltip } from "@coss-sv/ui";
</script>
<Group.Root aria-label="Message composer" class="[--radius-lg:9999px] [--radius:9999rem]">
  <Group.Root aria-label="Attachments">
    <Button aria-label="Attach file" size="icon" variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={Attachment01Icon} strokeWidth={2} />
    </Button>
  </Group.Root>
  <Group.Root aria-label="Message input">
    <InputGroup.Root>
      <InputGroup.Input placeholder="Send a message" />
      <InputGroup.Addon align="inline-end">
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Voice Mode"
            class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
          >
            <HugeiconsIcon aria-hidden="true" icon={Mic01Icon} strokeWidth={2} />
          </Tooltip.Trigger>
          <Tooltip.Popup>Voice Mode</Tooltip.Popup>
        </Tooltip.Root>
      </InputGroup.Addon>
    </InputGroup.Root>
  </Group.Root>
</Group.Root>
