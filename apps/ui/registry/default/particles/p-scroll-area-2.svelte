<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["scroll-area"],
    id: "p-scroll-area-2",
    interactive: true,
    responsive: true,
    title: "Horizontal scroll area",
  });
</script>

<script lang="ts">
  import { ScrollArea } from "@coss-sv/ui";
</script>

<ScrollArea class="max-w-96 rounded-lg border"
  ><div class="flex w-max gap-4 p-4">
    {#each Array.from({ length: 20 }) as _, index (index)}<div
        class="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted"
      >
        <span class="font-medium text-sm">Item {index + 1}</span>
      </div>{/each}
  </div></ScrollArea
>
