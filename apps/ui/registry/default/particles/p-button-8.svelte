<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-8",
    interactive: true,
    responsive: false,
    title: "Extra-small button",
  });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button size="xs">Button</Button>
