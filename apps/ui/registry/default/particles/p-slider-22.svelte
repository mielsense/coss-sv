<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "number-field", "slider"],
    id: "p-slider-22",
    interactive: true,
    responsive: true,
    title: "Price distribution",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Button, InputGroup, NumberField, Slider } from "@coss-sv/ui";

  const prices = [
    80, 95, 110, 125, 130, 140, 145, 150, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255,
    260, 265, 270, 275, 280, 285, 290, 290, 295, 295, 295, 298, 299, 300, 305, 310, 315, 320, 325,
    330, 335, 340, 345, 350, 355, 360, 365, 365, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420,
    425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 495, 498, 499, 500,
    500, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 655, 660, 665, 670, 675, 680, 685,
    690, 695, 700, 700, 700, 700, 700, 700, 725, 750, 775, 800, 815, 830, 845, 845, 845, 870, 875,
    880, 885, 890, 895, 898, 900,
  ];
  const tickCount = 40;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const priceStep = (max - min) / tickCount;
  const counts = Array.from(
    { length: tickCount },
    (_, tick) =>
      prices.filter(
        (price) => price >= min + tick * priceStep && price < min + (tick + 1) * priceStep,
      ).length,
  );
  const maxCount = Math.max(...counts);
  let values = $state<number[]>([200, 780]);
  const countInRange = $derived(
    prices.filter((price) => price >= (values[0] ?? min) && price <= (values[1] ?? max)).length,
  );
  function updateValue(index: number, next: number | null) {
    const value = next ?? min;
    values =
      index === 0
        ? [Math.min(value, values[1] ?? max), values[1] ?? max]
        : [values[0] ?? min, Math.max(value, values[0] ?? min)];
  }
  function selected(index: number) {
    return (
      countInRange > 0 &&
      min + index * priceStep <= (values[1] ?? max) &&
      min + (index + 1) * priceStep >= (values[0] ?? min)
    );
  }
</script>

<div class="flex flex-col gap-4">
  <div>
    <div aria-hidden="true" class="flex h-12 w-full items-end px-3">
      {#each counts as count, index}
        <div class="flex flex-1 justify-center" style:height={`${(count / maxCount) * 100}%`}>
          <span
            class="mx-px size-full bg-primary/20 data-[selected=true]:bg-primary/50"
            data-selected={selected(index)}
          ></span>
        </div>
      {/each}
    </div>
    <Slider.Root aria-label="Price range" class="*:min-w-0!" {max} {min} bind:value={values} />
  </div>
  <div class="flex items-center justify-between gap-4">
    <InputGroup.Root
      ><NumberField.Root
        aria-label="Minimum price"
        max={values[1]}
        {min}
        onValueChange={(next) => updateValue(0, next)}
        value={values[0]}><NumberField.Input class="text-left" /></NumberField.Root
      ><InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon></InputGroup.Root
    >
    <InputGroup.Root
      ><NumberField.Root
        aria-label="Maximum price"
        {max}
        min={values[0]}
        onValueChange={(next) => updateValue(1, next)}
        value={values[1]}><NumberField.Input class="text-left" /></NumberField.Root
      ><InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon></InputGroup.Root
    >
  </div>
  <Button class="w-full" variant="outline">Show {countInRange} items</Button>
</div>
