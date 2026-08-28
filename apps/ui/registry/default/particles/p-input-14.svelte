<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["input", "label"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-14",
  interactive: true,
  responsive: false,
  title: "Input with optional label",
});
</script>

<script lang="ts">
import { Input, Label } from "@coss-sv/ui";

const id = $props.id();
</script>

<div class="flex flex-col gap-2">
  <div class="inline-flex w-full items-center justify-between gap-2">
    <Label for={id}>Email</Label>
    <span class="font-medium text-muted-foreground text-sm">Optional</span>
  </div>
  <Input {id} placeholder="Email" type="email" />
</div>
