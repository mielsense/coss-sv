<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "field", "fieldset", "form", "radio-group"],
  id: "p-radio-group-5",
  interactive: true,
  responsive: false,
  title: "Radio group form",
});
</script>

<script lang="ts">
import { Button, Field, Fieldset, Form, RadioGroup } from "@coss-sv/ui";

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite" },
  { value: "astro", label: "Astro" },
];
let loading = $state(false);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget as HTMLFormElement);
  loading = true;
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  loading = false;
  window.alert(`Selected: ${formData.get("frameworks")}`);
}
</script>

<Form class="flex w-full max-w-[160px] flex-col gap-4" onsubmit={submit}>
  <Field.Root as="fieldset" class="gap-2" name="frameworks">
    <Fieldset.Legend class="font-medium text-sm">Frameworks</Fieldset.Legend>
    <RadioGroup.Root defaultValue="next">
      {#each frameworks as framework (framework.value)}
        <Field.Item>
          <Field.Label><RadioGroup.Item value={framework.value} />{framework.label}</Field.Label>
        </Field.Item>
      {/each}
    </RadioGroup.Root>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
