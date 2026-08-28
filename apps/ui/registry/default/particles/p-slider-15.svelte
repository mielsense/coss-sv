<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["fieldset", "slider"],
  id: "p-slider-15",
  interactive: true,
  responsive: true,
  title: "Price range",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
});
</script>

<script lang="ts">
import { Fieldset, Slider } from "@coss-sv/ui";
const min = 5;
const max = 1240;
let values = $state<number[]>([min, max]);
const formatPrice = (price: number) =>
  price === max ? `$${price.toLocaleString()}+` : `$${price.toLocaleString()}`;
</script>

<Fieldset.Root class="flex w-full flex-col gap-3">
  <Fieldset.Legend class="tabular-nums"
    >From {formatPrice(values[0] ?? min)} to {formatPrice(values[1] ?? max)}</Fieldset.Legend
  >
  <Slider.Root
    aria-label="Price range"
    class="flex-1"
    {max}
    {min}
    name="price-range"
    bind:value={values}
  />
</Fieldset.Root>
