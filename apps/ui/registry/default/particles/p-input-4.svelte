<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["input"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-4",
  interactive: true,
  responsive: false,
  title: "Disabled input",
});
</script>

<script lang="ts">
import { Input } from "@coss-sv/ui";
</script>

<Input aria-label="Disabled" disabled placeholder="Disabled" type="text" />
