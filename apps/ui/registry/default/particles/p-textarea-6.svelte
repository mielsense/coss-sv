<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "field", "form", "textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-textarea-6",
    interactive: true,
    responsive: false,
    title: "Textarea in form",
  });
</script>

<script lang="ts">
  import { Button, Field, Form, Textarea } from "@coss-sv/ui";

  let loading = $state(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    loading = false;
    alert(`Message: ${formData.get("message") || ""}`);
  }
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={submit}>
  <Field.Root>
    <Field.Label>Message</Field.Label>
    <Textarea name="message" placeholder="Type your message here" required />
    <Field.Error>This field is required.</Field.Error>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
