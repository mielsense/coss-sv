<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-10",
    interactive: true,
    responsive: false,
    title: "Large button",
  });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button size="lg">Button</Button>
