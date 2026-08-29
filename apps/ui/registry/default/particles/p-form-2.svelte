<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "field", "form", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-form-2",
    interactive: true,
    responsive: false,
    title: "Form with zod validation",
  });
</script>

<script lang="ts">
  import { Button, Field, Form, Input } from "@coss-sv/ui";
  import { z } from "zod";

  const schema = z.object({
    age: z.coerce
      .number({ message: "Please enter a number." })
      .positive({ message: "Number must be positive." }),
    name: z.string().min(1, { message: "Please enter a name." }),
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
    if (result.success) {
      alert(`Name: ${formData.get("name") || ""}\nAge: ${formData.get("age") || ""}`);
    }
  }
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" {errors} onsubmit={submit}>
  <Field.Root name="name">
    <Field.Label>Name</Field.Label>
    <Input placeholder="Enter name" />
    <Field.Error />
  </Field.Root>
  <Field.Root name="age">
    <Field.Label>Age</Field.Label>
    <Input placeholder="Enter age" />
    <Field.Error />
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
