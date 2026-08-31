<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "spinner", "toast"],
    id: "p-toast-8",
    interactive: true,
    responsive: false,
    title: "Submit error toast",
  });
</script>

<script lang="ts">
  import { Button, Spinner, Toast } from "@coss-sv/ui";
  import { onDestroy } from "svelte";

  const toastManager = new Toast.Manager();
  let button = $state<HTMLButtonElement | null>(null);
  let submitting = $state(false);
  let toastId: string | null = null;
  let submitTimer: ReturnType<typeof setTimeout> | undefined;

  function submit() {
    if (!button || submitting) return;
    if (toastId) {
      toastManager.close(toastId);
      toastId = null;
    }
    submitting = true;
    submitTimer = setTimeout(() => {
      submitting = false;
      if (button)
        toastId = toastManager.add({
          description: "The server is not responding. Please try again later.",
          positionerProps: { anchor: button, sideOffset: 4 },
          title: "Error submitting form",
          type: "error",
        });
    }, 2000);
  }

  onDestroy(() => {
    if (submitTimer) clearTimeout(submitTimer);
  });
</script>

<Toast.AnchoredProvider {toastManager}>
  <Button bind:ref={button} disabled={submitting} onclick={submit} variant="outline">
    {#if submitting}<Spinner />Submitting…{:else}Submit{/if}
  </Button>
</Toast.AnchoredProvider>
