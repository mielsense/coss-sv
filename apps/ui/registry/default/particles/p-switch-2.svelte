<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["label", "switch"],
  id: "p-switch-2",
  interactive: true,
  responsive: false,
  title: "Disabled switch",
});
</script>

<script lang="ts">
import { Label, Switch } from "@coss-sv/ui";
</script>

<Label
  ><Switch aria-label="Marketing emails" disabled />
  Marketing emails</Label
>
