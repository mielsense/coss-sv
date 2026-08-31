<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle"],
    id: "p-toggle-4",
    interactive: true,
    responsive: false,
    title: "Small toggle",
  });
</script>

<script lang="ts">
  import { Toggle } from "@coss-sv/ui";
</script>

<Toggle size="sm" variant="outline">Small</Toggle>
