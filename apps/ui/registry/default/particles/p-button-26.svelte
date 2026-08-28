<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-26",
  interactive: true,
  responsive: false,
  title: "Star button with count",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

let starred = $state(false);
</script>

<Button onclick={() => (starred = !starred)}>
  <HugeiconsIcon
    aria-hidden="true"
    class={starred ? "fill-yellow-500 text-yellow-500" : undefined}
    icon={StarIcon}
    strokeWidth={2}
  />
  <span class="flex items-baseline gap-2">
    {starred ? "Starred" : "Star"}
    <span class="text-primary-foreground/60 text-xs">{starred ? 730 : 729}</span>
  </span>
</Button>
