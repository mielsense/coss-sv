<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-6",
  interactive: true,
  responsive: false,
  title: "Ghost button",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
</script>

<Button variant="ghost">Ghost</Button>
