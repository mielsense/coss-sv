<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "checkbox", "checkbox-group", "field", "fieldset", "form"],
    id: "p-checkbox-group-5",
    interactive: true,
    responsive: false,
    title: "Checkbox group form",
  });
</script>

<script lang="ts">
  import { Button, CheckboxGroup, Field, Fieldset, Form } from "@coss-sv/ui";
  import { createDemoDelay } from "../lib/demo-delay.js";

  const delay = createDemoDelay();
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
    if (!(await delay())) return;
    loading = false;
    window.alert(`Selected: ${formData.getAll("frameworks").join(", ") || "none"}`);
  }
</script>

<Form class="flex w-full max-w-[160px] flex-col gap-4" onsubmit={submit}>
  <Field.Root as="fieldset" name="frameworks">
    <Fieldset.Legend class="font-medium text-sm">Frameworks</Fieldset.Legend>
    <CheckboxGroup.Root defaultValue={["next"]}>
      {#each frameworks as framework (framework.value)}
        <Field.Item>
          <Field.Label><CheckboxGroup.Item value={framework.value} />{framework.label}</Field.Label>
        </Field.Item>
      {/each}
    </CheckboxGroup.Root>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
