<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["checkbox", "label"],
    id: "p-checkbox-4",
    interactive: true,
    responsive: true,
    title: "Card checkbox",
  });
</script>

<script lang="ts">
  import { Checkbox, Label } from "@coss-sv/ui";
</script>

<Label
  class="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
>
  <Checkbox checked />
  <div class="flex flex-col gap-1">
    <p>Enable notifications</p>
    <p class="text-muted-foreground text-xs">
      You can enable or disable notifications at any time.
    </p>
  </div>
</Label>
