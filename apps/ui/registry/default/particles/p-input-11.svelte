<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["input-group", "kbd"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-11",
  interactive: true,
  responsive: false,
  title: "Input group with keyboard shortcut",
});
</script>

<script lang="ts">
import { InputGroup, Kbd } from "@coss-sv/ui";
</script>

<InputGroup.Root>
  <InputGroup.Input aria-label="Search" placeholder="Search…" type="search" />
  <InputGroup.Addon align="inline-end"><Kbd>/</Kbd></InputGroup.Addon>
</InputGroup.Root>
