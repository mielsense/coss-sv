<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-10",
    interactive: true,
    responsive: false,
    title: "Read-only textarea",
  });
</script>

<script lang="ts">
  import { Textarea } from "@coss-sv/ui";
</script>

<Textarea class="read-only:bg-muted" value="This is a read-only textarea" readonly />
