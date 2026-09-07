<script lang="ts">
  import * as Select from "./index.js";
  const people = [
    { id: "first", label: "Alex" },
    { id: "second", label: "Alex" },
  ];
  let value = $state.raw<(typeof people)[number] | null>(null);
  let identity = $state(false);
</script>

<Select.Root
  bind:value
  items={people.map((person) => ({ label: person.label, value: person }))}
  itemToStringLabel={(person) => person.label}
  onValueChange={(person) => (identity = person === people[1])}
>
  <Select.Trigger aria-label="Duplicate labels"><Select.Value /></Select.Trigger>
  <Select.Popup>
    {#each people as person (person.id)}
      <Select.Item value={person}>{person.label}</Select.Item>
    {/each}
  </Select.Popup>
</Select.Root>
<output data-testid="identity">{identity ? "same" : "different"}</output>
<output data-testid="selected-id">{value?.id}</output>
