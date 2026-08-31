<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["autocomplete"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-6",
    interactive: true,
    responsive: false,
    title: "Autocomplete autofilling the input with the highlighted item",
  });
</script>

<script lang="ts">
  import { Autocomplete } from "@coss-sv/ui";

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
</script>

<Autocomplete.Root {items} mode="both">
  <Autocomplete.Input aria-label="Search items" placeholder="Search items…"></Autocomplete.Input>

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
