<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-39",
  interactive: true,
  responsive: false,
  title: "Menu button",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

let menuOpen = $state(false);
</script>

<Button
  aria-expanded={menuOpen}
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  onclick={() => (menuOpen = !menuOpen)}
  size="icon"
  variant="outline"
>
  <HugeiconsIcon
    aria-hidden="true"
    class="transition-transform duration-300"
    icon={menuOpen ? Cancel01Icon : Menu01Icon}
    strokeWidth={2}
  />
</Button>
