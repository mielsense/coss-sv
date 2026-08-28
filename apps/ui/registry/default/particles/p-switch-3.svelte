<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["label", "switch"],
  id: "p-switch-3",
  interactive: true,
  responsive: false,
  title: "Switch with description",
});
</script>

<script lang="ts">
import { Label, Switch } from "@coss-sv/ui";

const id = $props.id();
const labelId = `${id}-label`;
</script>

<div class="flex items-start gap-2">
  <Switch aria-labelledby={labelId} checked {id} />
  <div class="flex flex-col gap-1">
    <Label for={id} id={labelId}>Marketing emails</Label>
    <p class="text-muted-foreground text-xs">
      By enabling marketing emails, you agree to receive emails.
    </p>
  </div>
</div>
