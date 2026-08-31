<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input", "label"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-6",
    interactive: true,
    responsive: false,
    title: "Input with label",
  });
</script>

<script lang="ts">
  import { Input, Label } from "@coss-sv/ui";

  const id = $props.id();
</script>

<div class="flex flex-col items-start gap-2">
  <Label for={id}>Email</Label>
  <Input aria-label="Email" {id} placeholder="you@example.com" type="email" />
</div>
