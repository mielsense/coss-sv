<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-13",
  interactive: true,
  responsive: false,
  title: "Icon button",
});
</script>

<script lang="ts">
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button } from "@coss-sv/ui";
</script>

<Button aria-label="Add" size="icon"
  ><HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} /></Button
>
