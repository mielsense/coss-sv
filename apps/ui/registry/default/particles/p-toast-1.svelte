<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-1",
    interactive: true,
    responsive: false,
    title: "Default toast",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";
</script>

<Toast.Provider
  ><Button
    onclick={() =>
      Toast.toastManager.add({
        description: "Monday, January 3rd at 6:00pm",
        title: "Event has been created",
      })}
    variant="outline">Default Toast</Button
  ></Toast.Provider
>
