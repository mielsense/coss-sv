<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-18",
    interactive: false,
    responsive: false,
    title: "Failed badge",
  });
</script>

<script lang="ts">
  import { Badge } from "@coss-sv/ui";
</script>

<Badge variant="outline"
  ><span aria-hidden="true" class="size-1.5 rounded-full bg-red-500"></span>Failed</Badge
>
