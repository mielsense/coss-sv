<script lang="ts">
  import { untrack } from "svelte";
  import * as Combobox from "./index.js";
  import { createComboboxItems } from "./items.js";

  type User = { id: string; name: string };
  type Group = { label: string; items: readonly User[] };
  let {
    grouped = false,
    multiple = false,
    initial = "ada",
    externalOnly = false,
    customFilter = false,
    search = false,
  }: {
    grouped?: boolean;
    multiple?: boolean;
    initial?: string;
    externalOnly?: boolean;
    customFilter?: boolean;
    search?: boolean;
  } = $props();
  let users = $state.raw<readonly User[]>([
    { id: "ada", name: "Ada Lovelace" },
    { id: "grace", name: "Grace Hopper" },
  ]);
  const data = $derived(grouped ? [{ label: "People", items: users }] : users);
  const items = $derived(
    createComboboxItems(data, {
      getValue: (user: User) => user.id,
      getLabel: (user: User) => user.name,
    }),
  );
  let value = $state<string | string[] | null>(untrack(() => (multiple ? [initial] : initial)));
  const Selected = Combobox.Value<string, boolean>;
  const filtered = $derived(
    externalOnly ? [{ id: "katherine", name: "Katherine Johnson" }] : undefined,
  );
  const filter = $derived(
    customFilter
      ? (user: User, query: string, label?: (user: User) => string) =>
          user.name.startsWith(query) && label?.(user) === user.name
      : undefined,
  );
</script>

<button
  type="button"
  onclick={() => (users = users.map((user) => ({ ...user, name: `${user.name} updated` })))}
>
  Replace items
</button>
<form data-testid="form">
  <Combobox.Root
    {items}
    {multiple}
    {filter}
    filteredItems={filtered}
    bind:value
    name="person"
    itemToStringLabel={(id) => `Unknown ${id}`}
  >
    {#if multiple}
      <Combobox.Chips><Combobox.ChipsInput aria-label="Choose person" /></Combobox.Chips>
    {:else}
      <Combobox.Input aria-label="Choose person" type={search ? "search" : "text"} />
    {/if}
    <output data-testid="label"><Combobox.Value /></output>
    <output data-testid="value"
      ><Selected>{#snippet children(selected)}{JSON.stringify(selected)}{/snippet}</Selected
      ></output
    >
    <Combobox.Popup>
      <Combobox.List>
        {#snippet item(item: User | Group)}
          {#if "items" in item}
            <Combobox.Group items={item.items}>
              <Combobox.GroupLabel>{item.label}</Combobox.GroupLabel>
              <Combobox.Collection>
                {#snippet children(user: User)}
                  <Combobox.Item value={user.id}>{user.name}</Combobox.Item>
                {/snippet}
              </Combobox.Collection>
            </Combobox.Group>
          {:else}
            <Combobox.Item value={item.id}>{item.name}</Combobox.Item>
          {/if}
        {/snippet}
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
</form>
