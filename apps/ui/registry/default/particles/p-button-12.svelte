<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-12",
    interactive: true,
    responsive: false,
    title: "Disabled button",
  });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button disabled>Button</Button>
