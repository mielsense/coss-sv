<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-15",
    interactive: true,
    responsive: false,
    title: "Textarea with button aligned left",
  });
</script>

<script lang="ts">
  import { Button, Textarea } from "@coss-sv/ui";
</script>

<div class="flex flex-col gap-2">
  <Textarea placeholder="Type your message here" />
  <Button class="self-start">Send</Button>
</div>
