<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "spinner"],
    id: "p-button-18",
    interactive: true,
    responsive: false,
    title: "Custom loading button",
  });
</script>

<script lang="ts">
  import { Button, Spinner } from "@coss-sv/ui";
</script>

<Button disabled><Spinner />Loading...</Button>
