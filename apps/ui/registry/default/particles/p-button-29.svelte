<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-29",
    interactive: true,
    responsive: false,
    title: "Pill button",
  });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button class="rounded-full">Pill Button</Button>
