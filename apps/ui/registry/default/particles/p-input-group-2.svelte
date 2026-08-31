<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-2",
    interactive: true,
    responsive: false,
    title: "Input group with end icon",
  });
</script>

<script lang="ts">
  import { HugeiconsIcon, InputGroup } from "@coss-sv/ui";
  import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
</script>

<InputGroup.Root>
  <InputGroup.Input aria-label="Email" placeholder="Email" type="email" />
  <InputGroup.Addon align="inline-end">
    <HugeiconsIcon aria-hidden="true" icon={Mail01Icon} strokeWidth={2} />
  </InputGroup.Addon>
</InputGroup.Root>
