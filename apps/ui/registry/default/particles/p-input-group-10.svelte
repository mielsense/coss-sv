<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["badge", "input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-10",
    interactive: true,
    responsive: false,
    title: "Input group with badge",
  });
</script>

<script lang="ts">
  import { Badge, InputGroup } from "@coss-sv/ui";
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="Type to search…" type="search" />
  <InputGroup.Addon align="inline-end"><Badge variant="info">Badge</Badge></InputGroup.Addon>
</InputGroup.Root>
