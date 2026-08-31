<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-17",
    interactive: true,
    responsive: false,
    title: "Read-only input",
  });
</script>

<script lang="ts">
  import { Input } from "@coss-sv/ui";
</script>

<Input class="read-only:bg-muted" value="This is a read-only input" readonly type="text" />
