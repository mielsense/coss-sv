<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["spinner"],
    id: "p-spinner-1",
    interactive: false,
    responsive: false,
    title: "Loading spinner",
  });
</script>

<script lang="ts">
  import { Spinner } from "@coss-sv/ui";
</script>

<Spinner />
