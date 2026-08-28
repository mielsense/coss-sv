<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-33",
  interactive: true,
  responsive: false,
  title: "Paired buttons",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
</script>

<div class="inline-flex items-center gap-2">
  <Button variant="ghost">Cancel</Button><Button>Save</Button>
</div>
