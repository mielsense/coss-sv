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
  <span aria-hidden="true" class="relative block size-4">
    <HugeiconsIcon
      class={`absolute inset-0 transition-[transform,opacity] duration-300 motion-reduce:duration-0 ${menuOpen ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
      data-menu-icon="menu"
      icon={Menu01Icon}
      strokeWidth={2}
    />
    <HugeiconsIcon
      class={`absolute inset-0 transition-[transform,opacity] duration-300 motion-reduce:duration-0 ${menuOpen ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0"}`}
      data-menu-icon="cancel"
      icon={Cancel01Icon}
      strokeWidth={2}
    />
  </span>
</Button>
