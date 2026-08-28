<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-17",
    interactive: false,
    responsive: false,
    title: "Pending badge",
  });
</script>

<script lang="ts">
  import { Badge } from "@coss-sv/ui";
</script>

<Badge variant="outline"
  ><span aria-hidden="true" class="size-1.5 rounded-full bg-amber-500"></span>Pending</Badge
>
