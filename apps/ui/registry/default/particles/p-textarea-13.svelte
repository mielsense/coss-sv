<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-13",
    interactive: true,
    responsive: false,
    title: "Shorter textarea with fixed height",
  });
</script>

<script lang="ts">
  import { Textarea } from "@coss-sv/ui";
</script>

<Textarea class="*:field-sizing-fixed *:min-h-0" placeholder="Type your message here" rows={2} />
