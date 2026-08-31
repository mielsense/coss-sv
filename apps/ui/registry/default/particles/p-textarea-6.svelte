<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

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
  import { createDemoDelay } from "../lib/demo-delay.js";

  const delay = createDemoDelay();
  let loading = $state(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    loading = true;
    if (!(await delay())) return;
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
