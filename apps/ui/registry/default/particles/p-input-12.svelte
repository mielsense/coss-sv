<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input-group", "spinner"],
    id: "p-input-12",
    interactive: false,
    responsive: false,
    title: "Spinner in an input group",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { InputGroup, Spinner } from "@coss-sv/ui";
</script>

<InputGroup.Root>
  <InputGroup.Input disabled placeholder="Processing…" type="search" /><InputGroup.Addon>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
