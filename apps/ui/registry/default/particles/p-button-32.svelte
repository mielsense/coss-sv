<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["badge", "button"],
  id: "p-button-32",
  interactive: true,
  responsive: false,
  title: "Button with notification badge",
});
</script>

<script lang="ts">
import { Badge, Button } from "@coss-sv/ui";
</script>

<Button variant="outline">
  Messages
  <Badge class="-me-1" variant="outline">18</Badge>
</Button>
