<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "tooltip"],
  id: "p-tooltip-1",
  interactive: true,
  responsive: true,
  title: "Basic tooltip",
});
</script>
<script lang="ts">
import { Tooltip, buttonVariants } from "@coss-sv/ui";
</script>
<Tooltip.Provider
  ><Tooltip.Root
    ><Tooltip.Trigger class={buttonVariants({ variant: "outline" })}>Hover me</Tooltip.Trigger
    ><Tooltip.Popup>Helpful hint</Tooltip.Popup></Tooltip.Root
  ></Tooltip.Provider
>
