<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["progress"],
    id: "p-progress-2",
    interactive: false,
    responsive: false,
    title: "Progress with label and value",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Progress } from "@coss-sv/ui";
</script>

<Progress.Root value={60}
  ><div class="flex items-center justify-between gap-2">
    <Progress.Label>Export data</Progress.Label><Progress.Value />
  </div>
  <Progress.Track><Progress.Indicator /></Progress.Track></Progress.Root
>
