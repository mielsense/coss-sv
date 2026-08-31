<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "field", "input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-6",
    interactive: true,
    responsive: false,
    title: "Input group with field",
  });
</script>

<script lang="ts">
  import { Button, Field, HugeiconsIcon, InputGroup } from "@coss-sv/ui";
  import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
</script>

<Field.Root>
  <Field.Label>Subscribe</Field.Label>
  <InputGroup.Root>
    <InputGroup.Input placeholder="Your best email" type="email" />
    <InputGroup.Addon align="inline-end">
      <Button aria-label="Subscribe" size="icon-xs" variant="ghost">
        <HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} />
      </Button>
    </InputGroup.Addon>
  </InputGroup.Root>
  <Field.Error>Please enter a valid email address.</Field.Error>
</Field.Root>
