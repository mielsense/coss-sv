<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-4",
    interactive: true,
    responsive: false,
    title: "Disabled textarea",
  });
</script>

<script lang="ts">
  import { Textarea } from "@coss-sv/ui";
</script>

<Textarea disabled placeholder="Can't type here" />
