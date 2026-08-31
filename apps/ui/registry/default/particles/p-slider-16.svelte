<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["field", "slider"],
    id: "p-slider-16",
    interactive: true,
    responsive: true,
    title: "Rating slider",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Field, Slider } from "@coss-sv/ui";

  const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"];
  let value = $state<number | readonly number[]>(3);
  const currentValue = $derived(Array.isArray(value) ? (value[0] ?? 3) : value);
</script>

<Field.Root class="*:grid *:grid-cols-[auto_1fr_auto] *:items-center *:gap-x-2">
  <Slider.Root aria-label="Rate your experience" max={5} min={1} bind:value>
    <div class="col-span-3 mb-2 flex items-center justify-between gap-1">
      <Field.Label>Rate your experience</Field.Label>
      <span class="text-sm">{labels[currentValue - 1]}</span>
    </div>
    <span aria-hidden="true" class="text-2xl">😡</span>
    <span aria-hidden="true" class="order-1 text-2xl">😍</span>
  </Slider.Root>
</Field.Root>
