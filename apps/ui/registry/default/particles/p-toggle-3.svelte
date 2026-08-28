<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["toggle"],
  id: "p-toggle-3",
  interactive: true,
  responsive: false,
  title: "Toggle with icon",
});
</script>

<script lang="ts">
import { TextBoldIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Toggle } from "@coss-sv/ui";
</script>

<Toggle aria-label="Toggle bold" variant="outline">
  <HugeiconsIcon aria-hidden="true" icon={TextBoldIcon} strokeWidth={2} />
</Toggle>
