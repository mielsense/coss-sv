<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-15",
    interactive: false,
    responsive: false,
    title: "Badge notification count",
  });
</script>

<script lang="ts">
  import { Badge } from "@coss-sv/ui";
</script>

<Badge variant="outline">Notifications<span class="ms-1 font-semibold text-primary">5</span></Badge>
