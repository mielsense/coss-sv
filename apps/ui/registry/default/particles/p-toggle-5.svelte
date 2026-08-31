<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle"],
    id: "p-toggle-5",
    interactive: true,
    responsive: false,
    title: "Large toggle",
  });
</script>

<script lang="ts">
  import { Toggle } from "@coss-sv/ui";
</script>

<Toggle size="lg" variant="outline">Large</Toggle>
