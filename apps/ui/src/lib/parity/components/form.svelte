<script lang="ts">
import { Button, Field, Form, Input } from "@coss-sv/ui";

type Errors = Record<string, string | string[]>;

let errors = $state<Errors>({});
let loading = $state(false);

async function submitValidatedForm(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  const name = String(formData.get("name") ?? "");
  const ageValue = String(formData.get("age") ?? "");
  const age = Number(ageValue);
  const nextErrors: Errors = {};

  if (name.length < 1) nextErrors.name = ["Please enter a name."];
  if (Number.isNaN(age)) nextErrors.age = ["Please enter a number."];
  else if (age <= 0) nextErrors.age = ["Number must be positive."];

  loading = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  errors = nextErrors;
  loading = false;

  if (Object.keys(nextErrors).length === 0) {
    alert(`Name: ${name}\nAge: ${ageValue}`);
  }
}
</script>

<div class="parity-stack">
  <section class="w-full max-w-64" data-particle="p-form-1" id="p-form-1">
    <Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={(event) => event.preventDefault()}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Input placeholder="you@example.com" required type="email" />
        <Field.Error>Please enter a valid email.</Field.Error>
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Form>
  </section>

  <section class="w-full max-w-64" data-particle="p-form-2" id="p-form-2">
    <Form class="flex w-full max-w-64 flex-col gap-4" {errors} onsubmit={submitValidatedForm}>
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
  </section>
</div>

<style>
.parity-stack {
  display: grid;
  width: 100%;
  gap: 2rem;
  place-items: center;
}
</style>
