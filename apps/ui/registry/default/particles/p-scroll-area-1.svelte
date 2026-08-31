<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["scroll-area"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-scroll-area-1",
    interactive: true,
    responsive: true,
    title: "Basic scroll area",
  });
</script>

<script lang="ts">
  import { ScrollArea } from "@coss-sv/ui";
  const tags = Array.from({ length: 50 }, (_, index) => `v1.0.0-alpha.${index}`);
</script>

<ScrollArea class="h-64 rounded-lg border">
  <div class="px-4 py-2">
    <h4 class="mb-2 font-medium text-sm">Tags</h4>
    <div class="flex flex-col gap-1">
      {#each tags as tag (tag)}<div class="text-sm">{tag}</div>{/each}
    </div>
  </div>
</ScrollArea>
