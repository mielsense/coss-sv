<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["slider"],
  id: "p-slider-5",
  interactive: true,
  responsive: true,
  title: "Slider with ticks",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
});
</script>

<script lang="ts">
import { Slider } from "@coss-sv/ui";

const ticks = Array.from({ length: 13 }, (_, index) => index);
</script>
<div>
  <Slider.Root aria-label="Value selector" defaultValue={5} max={12} />
  <fieldset
    aria-label="Value scale from 0 to 12"
    class="mt-3 flex min-w-0 w-full items-center justify-between gap-1 border-0 px-2.5 py-0 font-medium text-muted-foreground text-xs"
  >
    {#each ticks as tick (tick)}
      <span class="flex w-0 flex-col items-center justify-center gap-2">
        <span class={["w-px bg-muted-foreground/72", tick % 2 === 0 ? "h-1" : "h-0.5"]}></span>
        <span class={tick % 2 !== 0 ? "opacity-0" : undefined}>{tick}</span>
      </span>
    {/each}
  </fieldset>
</div>
