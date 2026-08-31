<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "field", "form", "switch"],
    id: "p-switch-5",
    interactive: true,
    responsive: false,
    title: "Switch form",
  });
</script>

<script lang="ts">
  import { Button, Field, Form, Switch } from "@coss-sv/ui";
  import { createDemoDelay } from "../lib/demo-delay.js";

  const delay = createDemoDelay();
  let loading = $state(false);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    loading = true;
    if (!(await delay())) return;
    loading = false;
    window.alert(`Marketing emails: ${formData.get("marketing")}`);
  }
</script>

<Form class="flex flex-col gap-4" onsubmit={submit}>
  <Field.Root name="marketing">
    <Field.Label>
      <Switch checked name="marketing" />
      Enable marketing emails
    </Field.Label>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
