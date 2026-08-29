<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-41",
    interactive: true,
    responsive: false,
    title: "Built-in loading button",
  });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";

  let loading = $state(false);

  function submit() {
    loading = true;
    window.setTimeout(() => (loading = false), 1000);
  }
</script>

<Button {loading} onclick={submit}>Submit</Button>
