<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["checkbox", "label"],
  id: "p-checkbox-3",
  interactive: true,
  responsive: false,
  title: "Checkbox with description",
});
</script>

<script lang="ts">
import { Checkbox, Label } from "@coss-sv/ui";
const id = $props.id();
</script>

<div class="flex items-start gap-2">
  <Checkbox checked {id} />
  <div class="flex flex-col gap-1">
    <Label for={id}>Accept terms and conditions</Label>
    <p class="text-muted-foreground text-xs">
      By clicking this checkbox, you agree to the terms and conditions.
    </p>
  </div>
</div>
