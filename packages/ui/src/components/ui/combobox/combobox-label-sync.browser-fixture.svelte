<script lang="ts">
  import { untrack } from "svelte";
  import * as C from "./index.js";

  let {
    mode = "outside",
    initial = "Apple",
    initialInput,
    defaultInput,
    cancelInput = false,
  }: {
    mode?: "outside" | "popup" | "multiple" | "inline";
    initial?: string | null;
    initialInput?: string;
    defaultInput?: string;
    cancelInput?: boolean;
  } = $props();
  let blockInput = $state(untrack(() => cancelInput));
  const items = ["Apple", "Banana", "Orange"];
  let value = $state(untrack(() => initial));
  let inputValue = $state(untrack(() => initialInput));
  let inputEvents = $state<string[]>([]);
  let values = $state(["Apple"]);
</script>

<button
  type="button"
  data-testid="external-select"
  onclick={() => {
    value = "Banana";
    values = ["Banana"];
  }}>Select banana externally</button
>
<button
  type="button"
  data-testid="external-clear"
  onclick={() => {
    value = null;
    values = [];
  }}>Clear externally</button
>
<button type="button" onclick={() => (blockInput = false)}>Allow input</button>
<button type="button" onclick={() => (inputValue = "custom")}>Set independent input</button>
{#if mode === "multiple"}
  <C.Root {items} multiple bind:value={values}>
    <C.Chips><C.ChipsInput aria-label="Multiple search" /></C.Chips>
  </C.Root>
{:else}
  <C.Root
    {items}
    inline={mode === "inline"}
    {...defaultInput === undefined ? {} : { defaultInputValue: defaultInput }}
    bind:value
    bind:inputValue
    onInputValueChange={(_, details) => {
      inputEvents.push(details.reason);
      if (blockInput) details.cancel();
    }}
  >
    {#if mode !== "popup"}<C.Input aria-label="Search" />{:else}<C.Trigger aria-label="Open search"
        ><C.Value /></C.Trigger
      >{/if}
    <C.Popup>
      {#if mode === "popup"}<C.Input aria-label="Popup search" />{/if}
      <C.List
        ><C.Collection
          >{#snippet children(item)}<C.Item value={item}>{item}</C.Item>{/snippet}</C.Collection
        ></C.List
      >
    </C.Popup>
  </C.Root>
{/if}
<C.Root {items} defaultValue="Orange"><C.Input aria-label="Default selection" /></C.Root>
<C.Root defaultValue={{ label: "Object label", value: "object" }}
  ><C.Input aria-label="Object label" /></C.Root
>
<C.Root defaultValue={{ name: "Custom label" }} itemToStringLabel={(item) => item.name}
  ><C.Input aria-label="Custom label" /></C.Root
>
<C.Root
  multiple
  defaultValue={[{ person: { name: "Nested name" } }]}
  itemToStringLabel={(item: { person: { name: string } }) => item.person.name}
>
  <C.Chips><C.ChipsInput aria-label="Nested multiple search" /></C.Chips>
</C.Root>
<output data-testid="input-events">{inputEvents.join(",")}</output>
<output data-testid="selection-state">{value ?? "null"}</output>
<output data-testid="input-state">{inputValue ?? "undefined"}</output>
