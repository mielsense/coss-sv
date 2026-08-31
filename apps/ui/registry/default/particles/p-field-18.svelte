<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "checkbox", "field", "form", "input", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-18",
    interactive: true,
    responsive: false,
    title: "Complete form built with field",
  });
</script>

<script lang="ts">
  import { Button, Checkbox, Field, Form, Input, Select } from "@coss-sv/ui";
  import { createDemoDelay } from "../lib/demo-delay.js";

  const delay = createDemoDelay();
  const roles = [
    { label: "Select your role", value: null },
    { label: "Developer", value: "developer" },
    { label: "Designer", value: "designer" },
    { label: "Product Manager", value: "manager" },
    { label: "Other", value: "other" },
  ];
  let loading = $state(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    loading = true;
    if (!(await delay())) return;
    loading = false;
    alert(
      `Full name: ${formData.get("fullName") || ""}\nEmail: ${formData.get("email") || ""}\nRole: ${formData.get("role") || ""}\nNewsletter: ${formData.get("newsletter")}`,
    );
  }
</script>

<Form class="flex w-full flex-col gap-4" onsubmit={submit}>
  <Field.Root name="fullName">
    <Field.Label>
      Full Name <span class="text-destructive">*</span>
    </Field.Label>
    <Input placeholder="John Doe" required type="text" />
    <Field.Error>Please enter a valid name.</Field.Error>
  </Field.Root>
  <Field.Root name="email">
    <Field.Label>
      Email <span class="text-destructive">*</span>
    </Field.Label>
    <Input placeholder="john@example.com" required type="email" />
    <Field.Error>Please enter a valid email.</Field.Error>
  </Field.Root>
  <Field.Root name="role">
    <Field.Label>Role</Field.Label>
    <Select.Root items={roles}>
      <Select.Trigger><Select.Value /></Select.Trigger>
      <Select.Popup>
        {#each roles.slice(1) as role (role.value)}
          <Select.Item value={role.value}>{role.label}</Select.Item>
        {/each}
      </Select.Popup>
    </Select.Root>
    <Field.Description>This is an optional field</Field.Description>
  </Field.Root>
  <Field.Root name="newsletter">
    <div class="flex items-center gap-2">
      <Checkbox />
      <Field.Label class="cursor-pointer">Subscribe to newsletter</Field.Label>
    </div>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
