<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["switch"],
  id: "p-switch-6",
  interactive: true,
  responsive: false,
  title: "Custom switch size",
});
</script>

<script lang="ts">
import { Switch } from "@coss-sv/ui";
</script>

<Switch
  aria-label="Custom size"
  class="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
/>
