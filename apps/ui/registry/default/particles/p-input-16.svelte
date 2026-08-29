<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input-group", "spinner"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-16",
    interactive: false,
    responsive: false,
    title: "Input group with end loading spinner",
  });
</script>

<script lang="ts">
  import { InputGroup, Spinner } from "@coss-sv/ui";
</script>

<InputGroup.Root>
  <InputGroup.Input disabled placeholder="Processing…" type="search" />
  <InputGroup.Addon align="inline-end"><Spinner /></InputGroup.Addon>
</InputGroup.Root>
