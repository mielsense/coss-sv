<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["progress"],
    id: "p-progress-1",
    interactive: true,
    responsive: false,
    title: "Animated progress",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Progress } from "@coss-sv/ui";
  import { onDestroy } from "svelte";

  let value = $state(20);
  const interval = setInterval(
    () => (value = Math.min(100, Math.round(value + Math.random() * 25))),
    1000,
  );
  onDestroy(() => clearInterval(interval));
</script>

<Progress.Root {value} />
