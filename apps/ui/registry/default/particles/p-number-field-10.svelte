<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "field", "form", "number-field"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-number-field-10",
  interactive: true,
  responsive: false,
  title: "Number field in form",
});
</script>
<script lang="ts">
import { Button, Field, Form, NumberField } from "@coss-sv/ui";
import { z } from "zod";
const schema = z.object({
  quantity: z.coerce
    .number({ message: "Please enter a quantity." })
    .min(1, { message: "Quantity must be at least 1." })
    .max(100, { message: "Maximum quantity is 100." }),
});
type Errors = Record<string, string | string[]>;
let errors = $state<Errors>({});
let loading = $state(false);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget as HTMLFormElement);
  const result = schema.safeParse(Object.fromEntries(formData));
  loading = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  errors = result.success ? {} : (z.flattenError(result.error).fieldErrors as Errors);
  loading = false;
  if (result.success) alert(`Quantity: ${result.data.quantity}`);
}
</script>
<Form class="flex w-full max-w-64 flex-col gap-4" {errors} onsubmit={submit}>
  <Field.Root name="quantity">
    <NumberField.Root defaultValue={1} max={100} min={1}>
      <NumberField.ScrubArea label="Quantity" />
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
