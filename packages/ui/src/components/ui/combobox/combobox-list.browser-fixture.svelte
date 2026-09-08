<script lang="ts">
  import * as Combobox from "./index.js";

  const fruits = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];
  type Fruit = (typeof fruits)[number];
  const groups = [
    { label: "Citrus", items: [fruits[2], { label: "Lemon", value: "lemon" }] },
    { label: "Other fruit", items: fruits.slice(0, 2) },
  ];
  type FruitGroup = (typeof groups)[number];
</script>

<Combobox.Root items={fruits}>
  <Combobox.Input aria-label="List item fruit" />
  <Combobox.Popup>
    <Combobox.Empty>No fruit found.</Combobox.Empty>
    <Combobox.List>
      {#snippet item(fruit: Fruit, index: number)}
        <Combobox.Item value={fruit} data-index={index}>{fruit.label}</Combobox.Item>
      {/snippet}
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>

<Combobox.Root items={groups}>
  <Combobox.Input aria-label="Grouped list fruit" />
  <Combobox.Popup>
    <Combobox.Empty>No grouped fruit found.</Combobox.Empty>
    <Combobox.List>
      {#snippet item(group: FruitGroup, index: number)}
        <Combobox.Group items={group.items} data-group-index={index}>
          <Combobox.GroupLabel>{group.label}</Combobox.GroupLabel>
          <Combobox.Collection>
            {#snippet children(fruit: Fruit, itemIndex: number)}
              <Combobox.Item value={fruit} data-index={itemIndex}>{fruit.label}</Combobox.Item>
            {/snippet}
          </Combobox.Collection>
        </Combobox.Group>
      {/snippet}
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>

<Combobox.Root>
  <Combobox.Input aria-label="Static list fruit" />
  <Combobox.Popup>
    <Combobox.List>
      {#snippet children(state)}
        <Combobox.Item value="Apple" data-list-empty={state.empty}>Apple</Combobox.Item>
        <Combobox.Item value="Banana">Banana</Combobox.Item>
      {/snippet}
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
