<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-3",
    interactive: true,
    responsive: false,
    title: "Large input",
  });
</script>

<script lang="ts">
  import { Input } from "@coss-sv/ui";
</script>

<Input aria-label="Enter text" placeholder="Enter text" size="lg" type="text" />
