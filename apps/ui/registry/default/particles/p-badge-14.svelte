<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-14",
    interactive: false,
    responsive: false,
    title: "Rounded badge",
  });
</script>

<script lang="ts">
  import { Badge } from "@coss-sv/ui";
</script>

<Badge class="rounded-full">Badge</Badge>
