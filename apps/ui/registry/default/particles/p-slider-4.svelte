<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["slider"],
  id: "p-slider-4",
  interactive: true,
  responsive: true,
  title: "Storage slider",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
});
</script>

<script lang="ts">
import { Slider } from "@coss-sv/ui";
</script>
<div>
  <Slider.Root aria-label="Storage size in GB" defaultValue={15} max={35} min={5} />
  <fieldset
    aria-label="Storage size reference values"
    class="mt-4 flex min-w-0 w-full items-center justify-between gap-1 border-0 p-0 font-medium text-muted-foreground text-xs"
  >
    <span>5 GB</span><span>20 GB</span><span>35 GB</span>
  </fieldset>
</div>
