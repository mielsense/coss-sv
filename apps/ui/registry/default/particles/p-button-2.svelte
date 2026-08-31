<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-2",
    interactive: true,
    responsive: false,
    title: "Outline button",
  });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button variant="outline">Outline</Button>
