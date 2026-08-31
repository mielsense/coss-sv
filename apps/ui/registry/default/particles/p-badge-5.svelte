<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-5",
    interactive: false,
    responsive: false,
    title: "Badge example 5",
  });
</script>

<script lang="ts">
  import { Badge } from "@coss-sv/ui";
</script>

<Badge variant="info">Badge</Badge>
