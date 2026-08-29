<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["label", "textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-8",
    interactive: true,
    responsive: false,
    title: "Textarea with optional label",
  });
</script>

<script lang="ts">
  import { Label, Textarea } from "@coss-sv/ui";

  const id = $props.id();
</script>

<div class="flex flex-col gap-2">
  <div class="inline-flex w-full items-center justify-between gap-2">
    <Label for={id}>Message</Label>
    <Label as="span" class="font-normal text-muted-foreground">Optional</Label>
  </div>
  <Textarea {id} placeholder="Type your message here" />
</div>
