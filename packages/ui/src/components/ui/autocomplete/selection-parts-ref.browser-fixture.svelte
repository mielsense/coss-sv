<script lang="ts">
  import * as Autocomplete from "./index.js";
  import * as Combobox from "../combobox/index.js";
  import * as Select from "../select/index.js";

  let mounted = $state(true);

  let autocompleteEmptyRef = $state<HTMLElement | null>(null);
  let autocompleteGroupRef = $state<HTMLElement | null>(null);
  let autocompleteGroupLabelRef = $state<HTMLElement | null>(null);
  let autocompleteRowRef = $state<HTMLElement | null>(null);
  let autocompleteSeparatorRef = $state<HTMLElement | null>(null);
  let autocompleteStatusRef = $state<HTMLElement | null>(null);

  let comboboxEmptyRef = $state<HTMLElement | null>(null);
  let comboboxGroupRef = $state<HTMLElement | null>(null);
  let comboboxGroupLabelRef = $state<HTMLElement | null>(null);
  let comboboxRowRef = $state<HTMLElement | null>(null);
  let comboboxSeparatorRef = $state<HTMLElement | null>(null);
  let comboboxStatusRef = $state<HTMLElement | null>(null);

  let selectGroupRef = $state<HTMLElement | null>(null);
  let selectGroupLabelRef = $state<HTMLElement | null>(null);
  let selectSeparatorRef = $state<HTMLElement | null>(null);

  const refs = $derived([
    autocompleteEmptyRef,
    autocompleteGroupRef,
    autocompleteGroupLabelRef,
    autocompleteRowRef,
    autocompleteSeparatorRef,
    autocompleteStatusRef,
    comboboxEmptyRef,
    comboboxGroupRef,
    comboboxGroupLabelRef,
    comboboxRowRef,
    comboboxSeparatorRef,
    comboboxStatusRef,
    selectGroupRef,
    selectGroupLabelRef,
    selectSeparatorRef,
  ]);
</script>

<div hidden>
  <Autocomplete.Root items={[]}>
    {#if mounted}
      <Autocomplete.Empty bind:ref={autocompleteEmptyRef} data-testid="autocomplete-empty-ref" />
      <Autocomplete.Group bind:ref={autocompleteGroupRef} data-testid="autocomplete-group-ref">
        <Autocomplete.GroupLabel
          bind:ref={autocompleteGroupLabelRef}
          data-testid="autocomplete-group-label-ref"
        />
      </Autocomplete.Group>
      <Autocomplete.Row bind:ref={autocompleteRowRef} data-testid="autocomplete-row-ref" />
      <Autocomplete.Separator
        bind:ref={autocompleteSeparatorRef}
        data-testid="autocomplete-separator-ref"
      />
      <Autocomplete.Status bind:ref={autocompleteStatusRef} data-testid="autocomplete-status-ref" />
    {/if}
  </Autocomplete.Root>

  <Combobox.Root items={[]}>
    {#if mounted}
      <Combobox.Empty bind:ref={comboboxEmptyRef} data-testid="combobox-empty-ref" />
      <Combobox.Group bind:ref={comboboxGroupRef} data-testid="combobox-group-ref">
        <Combobox.GroupLabel
          bind:ref={comboboxGroupLabelRef}
          data-testid="combobox-group-label-ref"
        />
      </Combobox.Group>
      <Combobox.Row bind:ref={comboboxRowRef} data-testid="combobox-row-ref" />
      <Combobox.Separator bind:ref={comboboxSeparatorRef} data-testid="combobox-separator-ref" />
      <Combobox.Status bind:ref={comboboxStatusRef} data-testid="combobox-status-ref" />
    {/if}
  </Combobox.Root>

  <Select.Root>
    {#if mounted}
      <Select.Group bind:ref={selectGroupRef} data-testid="select-group-ref">
        <Select.GroupLabel bind:ref={selectGroupLabelRef} data-testid="select-group-label-ref" />
      </Select.Group>
      <Select.Separator bind:ref={selectSeparatorRef} data-testid="select-separator-ref" />
    {/if}
  </Select.Root>
</div>

<output data-testid="selection-part-ref-state">
  {refs.every((ref) => ref instanceof HTMLElement) ? "bound" : "missing"}
</output>
<output data-testid="selection-part-ref-cleanup">
  {!mounted && refs.every((ref) => ref === null) ? "cleared" : "pending"}
</output>
<button type="button" onclick={() => (mounted = false)}>Unmount selection parts</button>
