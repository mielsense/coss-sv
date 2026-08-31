<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle"],
    id: "p-toggle-2",
    interactive: true,
    responsive: false,
    title: "Outline toggle",
  });
</script>

<script lang="ts">
  import { Toggle } from "@coss-sv/ui";
</script>

<Toggle variant="outline">Outline Toggle</Toggle>
