<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-37",
    interactive: true,
    responsive: false,
    title: "Rotating add button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";

  let menuOpen = $state(false);
</script>

<Button
  aria-expanded={menuOpen}
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  class="rounded-full before:rounded-full"
  onclick={() => (menuOpen = !menuOpen)}
  size="icon"
  variant="outline"
>
  <HugeiconsIcon
    aria-hidden="true"
    class="transition-transform duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] in-[[aria-expanded=true]]:rotate-[135deg]"
    icon={Add01Icon}
    strokeWidth={2}
  />
</Button>
