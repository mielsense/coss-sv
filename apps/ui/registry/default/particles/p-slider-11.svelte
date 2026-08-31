<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["field", "slider"],
    id: "p-slider-11",
    interactive: true,
    responsive: true,
    title: "Volume slider",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Field, HugeiconsIcon, Slider } from "@coss-sv/ui";
  import VolumeHighIcon from "@hugeicons/core-free-icons/VolumeHighIcon";
  import VolumeMute02Icon from "@hugeicons/core-free-icons/VolumeMute02Icon";

  let value = $state<number | readonly number[]>(25);
</script>

<Field.Root class="*:grid *:grid-cols-[auto_1fr_auto] *:items-center *:gap-x-2">
  <Slider.Root aria-label="Volume slider" bind:value>
    <div class="col-span-3 mb-2 flex items-center justify-between gap-1">
      <Field.Label>Volume</Field.Label><Slider.Value />
    </div>
    <HugeiconsIcon
      aria-hidden="true"
      class="size-4 shrink-0 opacity-80"
      icon={VolumeMute02Icon}
      strokeWidth={2}
    />
    <HugeiconsIcon
      aria-hidden="true"
      class="order-1 size-4 shrink-0 opacity-80"
      icon={VolumeHighIcon}
      strokeWidth={2}
    />
  </Slider.Root>
</Field.Root>
