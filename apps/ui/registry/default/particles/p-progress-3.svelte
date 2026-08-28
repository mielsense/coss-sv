<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["progress"],
    id: "p-progress-3",
    interactive: false,
    responsive: false,
    title: "Formatted upload progress",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Progress } from "@coss-sv/ui";
</script>

<Progress.Root max={512} value={502}
  ><div class="flex items-center justify-between gap-2">
    <Progress.Label>Upload</Progress.Label><Progress.Value
      >{#snippet children(_formatted, value)}{value} / 512{/snippet}</Progress.Value
    >
  </div>
  <Progress.Track><Progress.Indicator /></Progress.Track></Progress.Root
>
