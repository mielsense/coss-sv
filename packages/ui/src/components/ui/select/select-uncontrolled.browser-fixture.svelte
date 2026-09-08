<script lang="ts">
  import * as Select from "./index.js";

  const people = [
    { id: "ada", name: "Ada Lovelace" },
    { id: "grace", name: "Grace Hopper" },
  ];
  const items = people.map((value) => ({ label: value.name, value }));
  type Person = (typeof people)[number];
  let lateValue = $state.raw<Person | null | undefined>();
</script>

<form data-testid="uncontrolled-select-form">
  <Select.Root
    {items}
    name="person"
    itemToStringLabel={(item: Person) => item.name}
    itemToStringValue={(item: Person) => item.id}
  >
    <Select.Trigger aria-label="Uncontrolled person"
      ><Select.Value placeholder="Choose" /></Select.Trigger
    >
    <Select.Popup alignItemWithTrigger={false}>
      {#each people as person (person.id)}
        <Select.Item value={person}>{person.name}</Select.Item>
      {/each}
    </Select.Popup>
  </Select.Root>
  <Select.Root
    {items}
    multiple
    name="people"
    itemToStringLabel={(item: Person) => item.name}
    itemToStringValue={(item: Person) => item.id}
  >
    <Select.Trigger aria-label="Uncontrolled people"
      ><Select.Value placeholder="Choose" /></Select.Trigger
    >
    <Select.Popup alignItemWithTrigger={false}>
      {#each people as person (person.id)}
        <Select.Item value={person}>{person.name}</Select.Item>
      {/each}
    </Select.Popup>
  </Select.Root>
</form>

<button type="button" onclick={() => (lateValue = people[0])}>Set bound Ada</button>
<button type="button" onclick={() => (lateValue = null)}>Clear bound person</button>
<Select.Root bind:value={lateValue} {items} itemToStringLabel={(item: Person) => item.name}>
  <Select.Trigger aria-label="Late bound person"
    ><Select.Value placeholder="Choose" /></Select.Trigger
  >
  <Select.Popup alignItemWithTrigger={false}>
    {#each people as person (person.id)}
      <Select.Item value={person}>{person.name}</Select.Item>
    {/each}
  </Select.Popup>
</Select.Root>
