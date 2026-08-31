<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete", "button", "field", "form"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-13",
    interactive: true,
    responsive: false,
    title: "Autocomplete form",
  });
</script>

<script lang="ts">
  import { Autocomplete, Button, Field, Form } from "@coss-sv/ui";
  import { createDemoDelay } from "../lib/demo-delay.js";

  const delay = createDemoDelay();
  const items = [
    "Apple",
    "Banana",
    "Orange",
    "Grape",
    "Strawberry",
    "Mango",
    "Pineapple",
    "Kiwi",
    "Peach",
    "Pear",
  ].map((label) => ({ label, value: label.toLowerCase() }));
  type Item = (typeof items)[number];
  let loading = $state(false);
  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const selected = new FormData(form).get("item");
    const value = items.find((item) => item.label === selected)?.value ?? selected ?? "";
    loading = true;
    if (!(await delay())) return;
    loading = false;
    alert(`Favorite item: ${value}`);
  }
</script>

<Form class="flex w-full max-w-64 flex-col gap-4" onsubmit={submit}>
  <Field.Root name="item">
    <Field.Label>Favorite item</Field.Label>
    <Autocomplete.Root {items} name="item" required>
      <Autocomplete.Input placeholder="Search items…" />
      <Autocomplete.Popup>
        <Autocomplete.Empty>No items found.</Autocomplete.Empty>
        <Autocomplete.List>
          <Autocomplete.Collection>
            {#snippet children(item: Item)}<Autocomplete.Item value={item}>
                {item.label}
              </Autocomplete.Item>{/snippet}
          </Autocomplete.Collection>
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete.Root>
    <Field.Error>Please select a item.</Field.Error>
  </Field.Root>
  <Button {loading} type="submit">Submit</Button>
</Form>
