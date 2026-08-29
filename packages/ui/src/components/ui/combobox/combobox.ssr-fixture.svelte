<script lang="ts">
  import * as Combobox from "./index.js";

  const items = ["Apple", "Banana"];
  const people = [
    { id: "ada", name: "Ada Lovelace" },
    { id: "grace", name: "Grace Hopper" },
  ];
</script>

{#snippet searchAddon()}
  <span data-testid="combobox-addon">Search</span>
{/snippet}

<Combobox.Root {items} value="Apple">
  <Combobox.Input
    aria-label="Fruit"
    clearProps={{ "aria-label": "Clear fruit", "data-testid": "composed-clear" }}
    showClear
    showTrigger
    size="sm"
    startAddon={searchAddon}
  />
</Combobox.Root>

<Combobox.Root {items} value="Apple">
  <Combobox.Clear data-testid="bare-clear" />
</Combobox.Root>

<Combobox.Root {items} value="Apple">
  <Combobox.Trigger data-testid="bare-combobox-trigger" />
</Combobox.Root>

<Combobox.Root items={people} value={people[1]}>
  <Combobox.Trigger aria-label="Typed combobox value">
    <Combobox.Value>
      {#snippet children(person: (typeof people)[number] | null)}
        <span data-testid="combobox-object-value">{person?.name}</span>
      {/snippet}
    </Combobox.Value>
  </Combobox.Trigger>
</Combobox.Root>
