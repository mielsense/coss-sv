<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["label", "switch"],
  id: "p-switch-4",
  interactive: true,
  responsive: true,
  title: "Card switch",
});
</script>

<script lang="ts">
import { Label, Switch } from "@coss-sv/ui";
const id = $props.id();
const labelId = `${id}-label`;
</script>

<Label
  class="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
  for={id}
  id={labelId}
>
  <div class="flex flex-col gap-1">
    <p>Enable notifications</p>
    <p class="text-muted-foreground text-xs">
      You can enable or disable notifications at any time.
    </p>
  </div>
  <Switch
    aria-labelledby={labelId}
    class="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
    checked
    {id}
  />
</Label>
