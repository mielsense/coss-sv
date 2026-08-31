<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-3",
    interactive: true,
    responsive: false,
    title: "Loading toast",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";

  const toastManager = new Toast.Manager();
</script>

<Toast.Provider {toastManager}>
  <Button
    onclick={() =>
      toastManager.add({
        description: "Please wait while we process your request.",
        title: "Loading…",
        type: "loading",
      })}
    variant="outline"
  >
    Loading Toast
  </Button>
</Toast.Provider>
