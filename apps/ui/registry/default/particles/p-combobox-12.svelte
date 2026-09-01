<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "combobox", "field", "form"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-12",
    interactive: true,
    responsive: false,
    title: "Combobox multiple form",
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
  let value = $state.raw<Item[]>([]);
  let loading = $state(false);
  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const selected = new FormData(event.currentTarget as HTMLFormElement).getAll("items");
    const selectedValues = selected.map(
      (selectedItem) =>
        items.find((item) => item.label === selectedItem)?.value ?? String(selectedItem),
    );
    loading = true;
    if (!(await delay())) return;
    loading = false;
    alert(`Favorite items: ${selectedValues.join(", ") || ""}`);
  }
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={submit}>
  <Field.Root name="items">
    <Field.Label>Favorite items</Field.Label>
    <Combobox.Root {items} multiple bind:value name="items" required>
      <Combobox.Chips>
        {#each value as item (item.value)}<Combobox.Chip aria-label={item.label}>
            {item.label}
          </Combobox.Chip>{/each}
        <Combobox.ChipsInput {...value.length ? {} : { placeholder: "Select items…" }} />
      </Combobox.Chips>
      <Combobox.Popup>
        <Combobox.Empty>No items found.</Combobox.Empty><Combobox.List>
          <Combobox.Collection>
            {#snippet children(item: Item)}<Combobox.Item value={item}>
                {item.label}
              </Combobox.Item>{/snippet}
          </Combobox.Collection>
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Root>
    <Field.Error>Please select at least one item.</Field.Error>
  </Field.Root><Button {loading} type="submit">Submit</Button>
</Form>
