<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "toggle"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
    id: "p-input-group-19",
    interactive: true,
    responsive: false,
    title: "Mini editor built with input group and toggle",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon, InputGroup, Toggle } from "@coss-sv/ui";
  import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
  import TextBoldIcon from "@hugeicons/core-free-icons/TextBoldIcon";
  import TextItalicIcon from "@hugeicons/core-free-icons/TextItalicIcon";
</script>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Tell us about yourself…" />
  <InputGroup.Addon align="block-start" class="gap-1 rounded-t-lg border-b bg-muted/72 p-2!">
    <Toggle aria-label="Toggle bold" size="sm">
      <HugeiconsIcon aria-hidden="true" icon={TextBoldIcon} strokeWidth={2} />
    </Toggle>
    <Toggle aria-label="Toggle italic" size="sm">
      <HugeiconsIcon aria-hidden="true" icon={TextItalicIcon} strokeWidth={2} />
    </Toggle>
    <Button aria-label="Link" size="icon-sm" variant="ghost">
      <HugeiconsIcon aria-hidden="true" icon={Link01Icon} strokeWidth={2} />
    </Button>
  </InputGroup.Addon>
</InputGroup.Root>
