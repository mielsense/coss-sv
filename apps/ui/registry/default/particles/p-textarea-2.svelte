<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-2",
    interactive: true,
    responsive: false,
    title: "Small textarea",
  });
</script>

<script lang="ts">
  import { Textarea } from "@coss-sv/ui";
</script>

<Textarea placeholder="Type your message here" size="sm" />
