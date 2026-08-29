<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["label", "textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-7",
    interactive: true,
    responsive: false,
    title: "Textarea with label and required indicator",
  });
</script>

<script lang="ts">
  import { Label, Textarea } from "@coss-sv/ui";

  const id = $props.id();
</script>

<div class="flex flex-col gap-2">
  <Label for={id}>Message <span class="text-destructive">*</span></Label>
  <Textarea {id} placeholder="Type your message here" required />
</div>
