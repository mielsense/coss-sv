<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-19",
    interactive: true,
    responsive: false,
    title: "Pill-shaped input",
  });
</script>

<script lang="ts">
  import { Input } from "@coss-sv/ui";
</script>

<Input
  aria-label="Enter text"
  class="[--radius-lg:9999px] [--radius:9999px]"
  placeholder="Enter text"
  type="text"
/>
