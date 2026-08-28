<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-11",
    interactive: true,
    responsive: false,
    title: "error upsert toast",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";
</script>

<Toast.Provider
  ><Button
    onclick={() =>
      Toast.toastManager.add({
        description: "Repeated clicks update this toast; errors use a shake animation.",
        id: "coss-demo-error-upsert",
        title: "Something went wrong",
        type: "error",
      })}
    variant="outline">One Error Toast</Button
  ></Toast.Provider
>
