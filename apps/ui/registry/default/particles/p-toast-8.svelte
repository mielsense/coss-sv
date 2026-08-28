<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

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

  let button = $state<HTMLButtonElement | null>(null);
  let submitting = $state(false);
  function submit() {
    if (!button || submitting) return;
    submitting = true;
    setTimeout(() => {
      submitting = false;
      if (button)
        Toast.anchoredToastManager.add({
          description: "The server is not responding. Please try again later.",
          positionerProps: { anchor: button, sideOffset: 4 },
          title: "Error submitting form",
          type: "error",
        });
    }, 2000);
  }
</script>

<Toast.AnchoredProvider
  ><Button bind:ref={button} disabled={submitting} onclick={submit} variant="outline"
    >{#if submitting}<Spinner />Submitting…{:else}Submit{/if}</Button
  ></Toast.AnchoredProvider
>
