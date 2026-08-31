<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-9",
    interactive: true,
    responsive: false,
    title: "Input group with button",
  });
</script>

<script lang="ts">
  import { Button, InputGroup } from "@coss-sv/ui";
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="Type to search…" type="search" />
  <InputGroup.Addon align="inline-end">
    <Button size="xs" variant="secondary">Search</Button>
  </InputGroup.Addon>
</InputGroup.Root>
