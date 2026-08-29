<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-20",
    interactive: true,
    responsive: false,
    title: "Back link button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
</script>

<Button variant="link"
  ><HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} strokeWidth={2} />Go back</Button
>
