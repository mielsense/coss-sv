<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "field", "form", "input"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-form-1",
  interactive: true,
  responsive: false,
  title: "Input in a form",
});
</script>

<script lang="ts">
import { Button, Field, Form, Input } from "@coss-sv/ui";

let loading = $state(false);

async function submit(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget as HTMLFormElement);
  loading = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  loading = false;
  alert(`Email: ${formData.get("email") || ""}`);
}
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={submit}>
  <Field.Root name="email">
    <Field.Label>Email</Field.Label>
    <Input placeholder="you@example.com" required type="email" />
    <Field.Error>Please enter a valid email.</Field.Error>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
