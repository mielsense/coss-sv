<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-10",
    interactive: false,
    responsive: false,
    title: "Badge example 10",
  });
</script>

<script lang="ts">
  import { Badge } from "@coss-sv/ui";
</script>

<Badge size="lg">Badge</Badge>
