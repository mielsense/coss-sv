<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["checkbox", "label"],
  id: "p-checkbox-1",
  interactive: true,
  responsive: false,
  title: "Basic checkbox",
});
</script>

<script lang="ts">
import { Checkbox, Label } from "@coss-sv/ui";
</script>

<Label><Checkbox />Accept terms and conditions</Label>
