<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle"],
    id: "p-toggle-6",
    interactive: true,
    responsive: false,
    title: "Disabled toggle",
  });
</script>

<script lang="ts">
  import { Toggle } from "@coss-sv/ui";
</script>

<Toggle disabled variant="outline">Disabled</Toggle>
