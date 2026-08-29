<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-19",
    interactive: true,
    responsive: false,
    title: "Expandable show more button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";

  let expanded = $state(false);
</script>

<Button
  aria-controls="expandable-content"
  aria-expanded={expanded}
  class="gap-1"
  onclick={() => (expanded = !expanded)}
  variant="ghost"
>
  {expanded ? "Show less" : "Show more"}
  <HugeiconsIcon
    aria-hidden="true"
    class="-me-1"
    icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
    strokeWidth={2}
  />
</Button>
