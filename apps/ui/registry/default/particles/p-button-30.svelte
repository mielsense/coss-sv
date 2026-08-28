<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-30",
  interactive: true,
  responsive: false,
  title: "Animated arrow button",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Button
  >Get Started<HugeiconsIcon
    aria-hidden="true"
    class="transition-transform in-[[data-slot=button]:hover]:translate-x-0.5"
    icon={ArrowRight01Icon}
    strokeWidth={2}
  /></Button
>
