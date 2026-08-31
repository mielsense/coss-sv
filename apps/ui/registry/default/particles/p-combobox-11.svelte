<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "combobox", "field", "form"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-11",
    interactive: true,
    responsive: false,
    title: "Combobox form",
  });
</script>

<script lang="ts">
  import { Button, Combobox, Field, Form } from "@coss-sv/ui";
  import { createDemoDelay } from "../lib/demo-delay.js";

  const delay = createDemoDelay();
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Mango", value: "mango" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Kiwi", value: "kiwi" },
    { label: "Peach", value: "peach" },
    { label: "Pear", value: "pear" },
  ] as const;
  type Item = (typeof items)[number];
  let loading = $state(false);
  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const selected = new FormData(event.currentTarget as HTMLFormElement).get("item");
    loading = true;
    if (!(await delay())) return;
    loading = false;
    alert(
      `Favorite item: ${items.find((item) => item.label === selected)?.value ?? selected ?? ""}`,
    );
  }
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={submit}>
  <Field.Root name="item">
    <Field.Label>Favorite item</Field.Label>
    <Combobox.Root {items} name="item" required>
      <Combobox.Input placeholder="Select an item..." /><Combobox.Popup>
        <Combobox.Empty>No results found.</Combobox.Empty><Combobox.List>
          <Combobox.Collection>
            {#snippet children(item: Item)}<Combobox.Item value={item}>
                {item.label}
              </Combobox.Item>{/snippet}
          </Combobox.Collection>
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Root>
    <Field.Error>Please select a item.</Field.Error>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
