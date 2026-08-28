<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "field", "form", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-11",
    interactive: true,
    responsive: false,
    title: "Select in form",
  });
</script>

<script lang="ts">
  import { Button, Field, Form, Select } from "@coss-sv/ui";

  const items = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Astro", value: "astro" },
  ];
  let loading = $state(false);
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const value = new FormData(e.currentTarget as HTMLFormElement).get("framework") ?? "";
    loading = true;
    await new Promise((r) => setTimeout(r, 800));
    loading = false;
    alert(`Framework: ${value}`);
  }
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={submit}
  ><Field.Root
    ><Field.Label>Framework</Field.Label><Select.Root
      aria-label="Select framework"
      {items}
      name="framework"
      required
      ><Select.Trigger><Select.Value placeholder="Select a framework" /></Select.Trigger
      ><Select.Popup
        >{#each items as item (item.value)}<Select.Item value={item.value}>{item.label}</Select.Item
          >{/each}</Select.Popup
      ></Select.Root
    ><Field.Description>Pick your favorite.</Field.Description><Field.Error
      >Please select a value.</Field.Error
    ></Field.Root
  ><Button {loading} type="submit">Submit</Button></Form
>
