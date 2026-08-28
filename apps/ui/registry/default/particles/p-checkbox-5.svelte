<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "checkbox", "field", "form"],
  id: "p-checkbox-5",
  interactive: true,
  responsive: false,
  title: "Checkbox form",
});
</script>

<script lang="ts">
import { Button, Checkbox, Field, Form } from "@coss-sv/ui";

let loading = $state(false);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget as HTMLFormElement);
  loading = true;
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  loading = false;
  window.alert(`Terms: ${formData.get("terms")}`);
}
</script>

<Form class="flex w-auto flex-col gap-4" onsubmit={submit}>
  <Field.Root name="terms">
    <Field.Label><Checkbox checked value="yes" />Accept terms and conditions</Field.Label>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
