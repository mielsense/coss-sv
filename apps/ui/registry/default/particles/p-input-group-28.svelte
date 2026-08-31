<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "tooltip"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
    id: "p-input-group-28",
    interactive: true,
    responsive: false,
    title: "Message composer with attachment buttons",
  });
</script>

<script lang="ts">
  import { Button, buttonVariants, HugeiconsIcon, InputGroup, Tooltip } from "@coss-sv/ui";
  import Attachment01Icon from "@hugeicons/core-free-icons/Attachment01Icon";
  import Image01Icon from "@hugeicons/core-free-icons/Image01Icon";
</script>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Compose your message…" rows={4} />
  <InputGroup.Addon align="block-end" class="justify-between">
    <Tooltip.Provider>
      <div class="flex gap-1">
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Attach file"
            class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
          >
            <HugeiconsIcon aria-hidden="true" icon={Attachment01Icon} strokeWidth={2} />
          </Tooltip.Trigger>
          <Tooltip.Popup>Attach file</Tooltip.Popup>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Insert image"
            class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
          >
            <HugeiconsIcon aria-hidden="true" icon={Image01Icon} strokeWidth={2} />
          </Tooltip.Trigger>
          <Tooltip.Popup>Insert image</Tooltip.Popup>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
    <Button size="sm">Send</Button>
  </InputGroup.Addon>
</InputGroup.Root>
