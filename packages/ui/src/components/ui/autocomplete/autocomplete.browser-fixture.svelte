<script lang="ts">
  import * as Autocomplete from "./index.js";
  const fruits = ["Apple", "Banana", "Orange", "Grape"];
  let value = $state("");
  let inlineValue = $state("");
  let asyncItems = $state<string[]>([]);
  let asyncPending = $state(false);
  let asyncRequest = 0;
  let resolveAsyncRequest: (() => void) | undefined;
  const people = [
    { id: "ada", name: "Ada Lovelace" },
    { id: "grace", name: "Grace Hopper" },
  ];
  let personValue = $state("");

  async function searchAsync(query: string): Promise<void> {
    const request = ++asyncRequest;
    asyncPending = query.length > 0;
    asyncItems = [];
    if (!query) return;
    await new Promise<void>((resolve) => {
      resolveAsyncRequest = resolve;
    });
    if (request !== asyncRequest) return;
    asyncItems = ["Async result"];
    asyncPending = false;
    resolveAsyncRequest = undefined;
  }

  function resolveAsyncSearch(): void {
    resolveAsyncRequest?.();
  }
</script>

<form data-testid="autocomplete-form">
  <Autocomplete.Root bind:value items={fruits} name="fruit">
    <Autocomplete.Input
      aria-label="Fruit search"
      placeholder="Search fruit"
      showClear
      showTrigger
    />
    <Autocomplete.Popup>
      <Autocomplete.Empty>No fruit found.</Autocomplete.Empty>
      <Autocomplete.List>
        <Autocomplete.Collection>
          {#snippet children(item)}
            <Autocomplete.Item value={item}>{item}</Autocomplete.Item>
          {/snippet}
        </Autocomplete.Collection>
      </Autocomplete.List>
    </Autocomplete.Popup>
  </Autocomplete.Root>
</form>
<output data-testid="autocomplete-value">{value}</output>

<Autocomplete.Root autoHighlight bind:value={inlineValue} items={fruits} mode="both">
  <Autocomplete.Input aria-label="Inline fruit" />
  <Autocomplete.Popup>
    <Autocomplete.List>
      <Autocomplete.Collection>
        {#snippet children(item)}
          <Autocomplete.Item value={item}>{item}</Autocomplete.Item>
        {/snippet}
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Popup>
</Autocomplete.Root>

<Autocomplete.Root
  bind:value={personValue}
  items={people}
  itemToStringValue={(item: (typeof people)[number]) => item.name}
>
  <Autocomplete.Input aria-label="Person search" />
  <Autocomplete.Popup>
    <Autocomplete.List>
      <Autocomplete.Collection>
        {#snippet children(item: (typeof people)[number])}
          <Autocomplete.Item value={item}>{item.name}</Autocomplete.Item>
        {/snippet}
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Popup>
</Autocomplete.Root>
<output data-testid="autocomplete-object-value">{personValue}</output>
<output data-testid="inline-value">{inlineValue}</output>

<Autocomplete.Root filter={null} items={asyncItems} onValueChange={searchAsync}>
  <Autocomplete.Input aria-label="Async search" />
  <Autocomplete.Popup aria-busy={asyncPending || undefined}>
    <Autocomplete.Status>{asyncPending ? "Searching..." : ""}</Autocomplete.Status>
    <Autocomplete.List>
      <Autocomplete.Collection>
        {#snippet children(item)}
          <Autocomplete.Item value={item}>{item}</Autocomplete.Item>
        {/snippet}
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Popup>
</Autocomplete.Root>
<button data-testid="resolve-async-search" onclick={resolveAsyncSearch} type="button">
  Resolve async search
</button>
