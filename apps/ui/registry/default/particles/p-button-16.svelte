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
import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button } from "@coss-sv/ui";
</script>

<Button><HugeiconsIcon aria-hidden="true" icon={Download01Icon} strokeWidth={2} />Download</Button>
