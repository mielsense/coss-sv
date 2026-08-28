<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-4",
    interactive: true,
    responsive: false,
    title: "Toast with action",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";

  function perform() {
    const id = Toast.toastManager.add({
      actionProps: {
        children: "Undo",
        onclick: () => {
          Toast.toastManager.close(id);
          Toast.toastManager.add({
            description: "The action has been reverted.",
            title: "Action undone",
            type: "info",
          });
        },
      },
      description: "You can undo this action.",
      timeout: 1000000,
      title: "Action performed",
      type: "success",
    });
  }
</script>

<Toast.Provider><Button onclick={perform} variant="outline">Perform Action</Button></Toast.Provider>
