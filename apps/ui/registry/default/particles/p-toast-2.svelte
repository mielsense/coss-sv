<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-2",
    interactive: true,
    responsive: true,
    title: "Status toasts",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";

  const statuses = [
    {
      label: "Success Toast",
      title: "Success!",
      description: "Your changes have been saved.",
      type: "success",
    },
    {
      label: "Error Toast",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      type: "error",
    },
    {
      label: "Info Toast",
      title: "Heads up!",
      description: "You can add components to your app using the cli.",
      type: "info",
    },
    {
      label: "Warning Toast",
      title: "Warning!",
      description: "Your session is about to expire.",
      type: "warning",
    },
  ] as const;
</script>

<Toast.Provider
  ><div class="flex flex-wrap gap-2">
    {#each statuses as status (status.type)}<Button
        onclick={() => Toast.toastManager.add(status)}
        variant="outline">{status.label}</Button
      >{/each}
  </div></Toast.Provider
>
