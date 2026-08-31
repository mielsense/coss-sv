<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input", "label"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-13",
    interactive: true,
    responsive: false,
    title: "Input with label and required indicator",
  });
</script>

<script lang="ts">
  import { Input, Label } from "@coss-sv/ui";

  const id = $props.id();
</script>

<div class="flex flex-col gap-2">
  <Label for={id}>
    Email <span class="text-destructive">*</span>
  </Label>
  <Input {id} placeholder="Email" required type="email" />
</div>
