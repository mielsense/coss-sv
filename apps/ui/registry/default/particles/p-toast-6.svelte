<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-6",
    interactive: true,
    responsive: true,
    title: "Varying height toasts",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";

  const toastManager = new Toast.Manager();
  const texts = [
    "Short message.",
    "A bit longer message that spans two lines.",
    "This is a longer description that intentionally takes more vertical space to demonstrate stacking with varying heights.",
    "An even longer description that should span multiple lines so we can verify the clamped collapsed height and smooth expansion animation when hovering or focusing the viewport.",
  ];
  let count = $state(0);
  function create() {
    count += 1;
    toastManager.add({
      description: texts[Math.floor(Math.random() * texts.length)],
      title: `Toast ${count} created`,
    });
  }
</script>

<Toast.Provider {toastManager}>
  <Button onclick={create} variant="outline">With Varying Heights</Button>
</Toast.Provider>
