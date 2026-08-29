<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-16",
    interactive: true,
    responsive: false,
    title: "Button with icon",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import { Download01Icon } from "@hugeicons/core-free-icons";
</script>

<Button><HugeiconsIcon aria-hidden="true" icon={Download01Icon} strokeWidth={2} />Download</Button>
