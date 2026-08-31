<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-14",
    interactive: true,
    responsive: false,
    title: "Small icon button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
</script>

<Button aria-label="Add" size="icon-sm">
  <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
</Button>
