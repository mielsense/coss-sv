<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["checkbox", "label"],
    id: "p-checkbox-2",
    interactive: true,
    responsive: false,
    title: "Disabled checkbox",
  });
</script>

<script lang="ts">
  import { Checkbox, Label } from "@coss-sv/ui";
</script>

<Label><Checkbox checked disabled />Accept terms and conditions</Label>
