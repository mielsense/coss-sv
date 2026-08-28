<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["toggle"],
  id: "p-toggle-1",
  interactive: true,
  responsive: false,
  title: "Default toggle",
});
</script>

<script lang="ts">
import { Toggle } from "@coss-sv/ui";
</script>

<Toggle>Toggle</Toggle>
