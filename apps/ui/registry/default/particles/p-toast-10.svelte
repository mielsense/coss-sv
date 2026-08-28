<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-10",
    interactive: true,
    responsive: false,
    title: "success upsert toast",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";
</script>

<Toast.Provider
  ><Button
    onclick={() =>
      Toast.toastManager.add({
        description: "Repeated clicks update this toast instead of stacking another.",
        id: "coss-demo-dedup-toast",
        title: "Saved",
        type: "success",
      })}
    variant="outline">One Success Toast</Button
  ></Toast.Provider
>
