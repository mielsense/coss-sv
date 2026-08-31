<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "tooltip"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
    id: "p-input-group-29",
    interactive: true,
    responsive: false,
    title: "Chat input with voice and send buttons",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Tooltip } from "@coss-sv/ui";
  import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
  import Mic01Icon from "@hugeicons/core-free-icons/Mic01Icon";
</script>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Type a message…" />
  <InputGroup.Addon align="block-end">
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="Voice message"
        class={buttonVariants({ size: "icon-sm", variant: "ghost", class: "rounded-full" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={Mic01Icon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup>Record voice message</Tooltip.Popup>
    </Tooltip.Root>
    <InputGroup.Text class="ml-auto text-muted-foreground text-xs">
      Press Enter to send
    </InputGroup.Text>
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="Send message"
        class={buttonVariants({ size: "icon-sm", variant: "default", class: "rounded-full" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup>Send</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
