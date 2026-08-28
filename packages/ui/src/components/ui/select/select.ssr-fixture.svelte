<script lang="ts">
import * as Select from "./index.js";

const items = [{ label: "Next.js", value: "next" }];
const people = [
  { id: "ada", name: "Ada Lovelace" },
  { id: "grace", name: "Grace Hopper" },
];
</script>
<Select.Root {items} value="next"
  ><Select.Label>Framework</Select.Label
  ><Select.Trigger><Select.Value /></Select.Trigger></Select.Root
>

<Select.Root items={["literal"]} value="literal">
  <Select.Trigger aria-label="Literal value">
    <Select.Value>
      {#snippet children()}
        <span data-testid="select-literal-value">Literal renderer</span>
      {/snippet}
    </Select.Value>
  </Select.Trigger>
</Select.Root>

<Select.Root
  items={people.map((person) => ({ label: person.name, value: person }))}
  itemToStringLabel={(person: (typeof people)[number]) => person.name}
  itemToStringValue={(person: (typeof people)[number]) => person.id}
  value={people[1]}
>
  <Select.Trigger aria-label="Typed object value">
    <Select.Value>
      {#snippet children(person: (typeof people)[number] | null)}
        <span data-testid="select-object-value">{person?.name}</span>
      {/snippet}
    </Select.Value>
  </Select.Trigger>
</Select.Root>
