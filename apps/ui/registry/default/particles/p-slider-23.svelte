<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "field", "fieldset", "form", "slider"],
  id: "p-slider-23",
  interactive: true,
  responsive: true,
  title: "Slider form",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
});
</script>

<script lang="ts">
import { Button, Field, Fieldset, Form, Slider } from "@coss-sv/ui";
let loading = $state(false);
let value = $state<number | readonly number[]>([25, 75]);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  loading = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  loading = false;
  const volumes = new FormData(event.currentTarget as HTMLFormElement).getAll("volume");
  window.alert(`Volume: ${volumes.join(", ")}`);
}
</script>

<Form class="flex w-full flex-col gap-4" onsubmit={submit}>
  <Fieldset.Root class="flex w-full flex-col items-stretch gap-3">
    <Field.Root>
      <Slider.Root name="volume" bind:value>
        <div class="mb-2 flex items-center justify-between gap-1">
          <Fieldset.Legend>Volume</Fieldset.Legend>
          <Slider.Value />
        </div>
      </Slider.Root>
      <Field.Description>Choose a value between 0 and 100</Field.Description>
    </Field.Root>
  </Fieldset.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
