<script lang="ts">
  import * as Combobox from "./index.js";

  const items = ["Apple", "Banana", "Orange", "Grape"];
  const people = [
    { id: "ada", name: "Ada Lovelace" },
    { id: "grace", name: "Grace Hopper" },
  ] as const;
  const duplicateNamePeople = [
    { id: "first", name: "Same name" },
    { id: "second", name: "Same name" },
  ] as const;
  const frameworks = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
  ];
  let single = $state<string | null>(null);
  let multiple = $state<string[]>(["Apple", "Grape"]);
  let inputValue = $state("");
  let person = $state<(typeof people)[number] | null>(null);
  let selectedPeople = $state.raw<(typeof people)[number][]>([people[0], people[1]]);
  let duplicateNameSelection = $state<(typeof duplicateNamePeople)[number][]>([
    duplicateNamePeople[1],
  ]);
  let nullablePeople = $state.raw<(typeof people)[number][] | null>(null);
  let personIdentity = $state("different");
</script>

<form data-testid="combobox-form">
  <Combobox.Root bind:inputValue bind:value={single} {items} name="fruit">
    <Combobox.Input aria-label="Choose fruit" placeholder="Select fruit" showClear />
    <Combobox.Popup>
      <Combobox.Empty>No fruit found.</Combobox.Empty>
      <Combobox.List>
        <Combobox.Collection>
          {#snippet children(item)}
            <Combobox.Item value={item}>{item}</Combobox.Item>
          {/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
  <Combobox.Root bind:value={multiple} {items} multiple name="fruits">
    <Combobox.Chips>
      {#each multiple as item (item)}
        <Combobox.Chip aria-label={item}>{item}<Combobox.ChipRemove /></Combobox.Chip>
      {/each}
      <Combobox.ChipsInput aria-label="Choose fruits" />
    </Combobox.Chips>
    <Combobox.Popup>
      <Combobox.List>
        <Combobox.Collection>
          {#snippet children(item)}
            <Combobox.Item value={item}>{item}</Combobox.Item>
          {/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
</form>
<output data-testid="single-value">{single ?? ""}</output>
<output data-testid="single-input">{inputValue}</output>
<output data-testid="multiple-value">{multiple.join(",")}</output>

<Combobox.Root
  bind:value={selectedPeople}
  items={people}
  itemToStringLabel={(item: (typeof people)[number]) => item.name}
  multiple
>
  <Combobox.Chips>
    {#each selectedPeople as selectedPerson (selectedPerson.id)}
      <Combobox.Chip aria-label={selectedPerson.name}>{selectedPerson.name}</Combobox.Chip>
    {/each}
    <Combobox.ChipsInput aria-label="Choose multiple people" />
  </Combobox.Chips>
  <Combobox.Popup>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: (typeof people)[number])}
          <Combobox.Item value={item}>{item.name}</Combobox.Item>
        {/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
<output data-testid="multiple-people-value">
  {selectedPeople.map((item) => item.name).join(",")}
</output>

<Combobox.Root
  bind:value={duplicateNameSelection}
  isItemEqualToValue={(item, selected) => item.id === selected.id}
  items={duplicateNamePeople}
  itemToStringLabel={(item) => item.name}
  multiple
>
  <Combobox.Chips>
    <Combobox.ChipsInput aria-label="Choose duplicate-name people" />
  </Combobox.Chips>
  <Combobox.Popup>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: (typeof duplicateNamePeople)[number])}
          <Combobox.Item value={item}>{item.name}</Combobox.Item>
        {/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
<output data-testid="duplicate-name-value">
  {duplicateNameSelection.map((item) => item.id).join(",")}
</output>

<Combobox.Root
  bind:value={nullablePeople}
  items={people}
  itemToStringLabel={(item) => item.name}
  multiple
>
  <Combobox.Chips>
    <Combobox.ChipsInput aria-label="Choose from a nullable value" />
  </Combobox.Chips>
  <Combobox.Popup>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: (typeof people)[number])}
          <Combobox.Item value={item}>{item.name}</Combobox.Item>
        {/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
<output data-testid="nullable-people-value">
  {(nullablePeople ?? []).map((item) => item.name).join(",")}
</output>

<Combobox.Root items={frameworks} value={frameworks[0]}>
  <Combobox.Trigger aria-label="Framework trigger"><Combobox.Value /></Combobox.Trigger>
  <Combobox.Popup>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: (typeof frameworks)[number])}
          <Combobox.Item value={item}>{item.label}</Combobox.Item>
        {/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>

<Combobox.Root
  bind:value={person}
  items={people}
  itemToStringLabel={(item: (typeof people)[number]) => item.name}
  itemToStringValue={(item: (typeof people)[number]) => item.name}
  onValueChange={(item) =>
    (personIdentity = `${item?.id ?? "null"}:${item === people[1] ? "same" : "different"}`)}
>
  <Combobox.Input aria-label="Choose person" />
  <Combobox.Popup>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: (typeof people)[number])}
          <Combobox.Item value={item}>{item.name}</Combobox.Item>
        {/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
<output data-testid="combobox-identity">{personIdentity}</output>

<Combobox.Root items={people} value={people[1]}>
  <Combobox.Trigger aria-label="Custom combobox person value">
    <Combobox.Value>
      {#snippet children(value: (typeof people)[number] | null)}
        <span data-testid="custom-combobox-value">{value?.name}</span>
      {/snippet}
    </Combobox.Value>
  </Combobox.Trigger>
</Combobox.Root>
