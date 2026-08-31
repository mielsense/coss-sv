<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-1",
    interactive: true,
    responsive: false,
    title: "Basic input",
  });
</script>

<script lang="ts">
  import { Input } from "@coss-sv/ui";
</script>

<Input aria-label="Enter text" placeholder="Enter text" type="text" />
