<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["autocomplete", "label"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-5",
    interactive: true,
    responsive: false,
    title: "Autocomplete with label",
  });
</script>

<script lang="ts">
  import { Autocomplete, Label } from "@coss-sv/ui";

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
  const id = $props.id();
</script>

<Autocomplete.Root {items}>
  <div class="flex flex-col items-start gap-2">
    <Label for={id}>Fruits</Label>
    <Autocomplete.Input aria-label="Search items" placeholder="Search items…" {id}
    ></Autocomplete.Input>
  </div>
  <Autocomplete.Popup>
    <Autocomplete.Empty>No items found.</Autocomplete.Empty>
    <Autocomplete.List>
      <Autocomplete.Collection>
        {#snippet children(item: Item)}
          <Autocomplete.Item value={item}>{item.label}</Autocomplete.Item>
        {/snippet}
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Popup>
</Autocomplete.Root>
