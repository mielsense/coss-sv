<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

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
  import { onDestroy } from "svelte";

  let loading = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function submit() {
    loading = true;
    clearTimeout(timer);
    timer = setTimeout(() => (loading = false), 1000);
  }

  onDestroy(() => clearTimeout(timer));
</script>

<Button {loading} onclick={submit}>Submit</Button>
