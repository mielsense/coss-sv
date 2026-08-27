<script lang="ts">
import * as NumberField from "./index.js";

let value = $state<number | null>(1.5);
let changes = $state(0);
let inputRef = $state<HTMLInputElement | null>(null);
let delegatedRef = $state<HTMLDivElement | null>(null);
let showRemountWheel = $state(true);
</script>

{#snippet delegatedGroup(props: NumberField.NumberFieldGroupProps)}
  <NumberField.Group {...props} />
{/snippet}

<form data-testid="number-form" style="width: 256px" onsubmit={(event) => event.preventDefault()}>
  <NumberField.Root
    bind:value
    data-testid="number-root"
    format={{ minimumFractionDigits: 1 }}
    locale="de-DE"
    max={3}
    min={-2}
    name="quantity"
    onValueChange={() => (changes += 1)}
    required
    step={0.5}
  >
    <NumberField.ScrubArea label="Quantity" />
    <NumberField.Group>
      <NumberField.Decrement data-testid="decrement" />
      <NumberField.Input bind:ref={inputRef} data-testid="number-input" />
      <NumberField.Increment data-testid="increment" />
    </NumberField.Group>
  </NumberField.Root>
  <button type="submit">Submit</button>
</form>

<NumberField.Root aria-label="Disabled number" defaultValue={2} disabled>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input data-testid="disabled-number" />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>

<NumberField.Root aria-invalid={true} aria-label="Invalid number" defaultValue={2} readonly>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input data-testid="readonly-number" />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>

<NumberField.Root allowWheel aria-label="Wheel number" defaultValue={1} step={2}>
  <NumberField.Group><NumberField.Input data-testid="wheel-number" /></NumberField.Group>
</NumberField.Root>

<NumberField.Root
  bind:ref={delegatedRef}
  aria-label="Delegated number"
  class="gap-0"
  data-testid="delegated-number"
  defaultValue={4}
  delegate={delegatedGroup}
>
  <NumberField.Input data-testid="delegated-number-input" />
</NumberField.Root>

<NumberField.Root aria-label="Invalid fill" defaultValue={0}>
  <NumberField.Group><NumberField.Input data-testid="invalid-fill-number" /></NumberField.Group>
</NumberField.Root>

<form data-testid="required-number-form">
  <NumberField.Root aria-label="Required number" name="required-number" required>
    <NumberField.Group><NumberField.Input data-testid="required-number" /></NumberField.Group>
  </NumberField.Root>
</form>

<NumberField.Root allowWheel aria-label="Cancelled wheel" defaultValue={1}>
  <NumberField.Group>
    <NumberField.Input
      data-testid="cancelled-wheel-number"
      onwheel={(event) => event.preventDefault()}
    />
  </NumberField.Group>
</NumberField.Root>

<button
  data-testid="toggle-wheel"
  type="button"
  onclick={() => (showRemountWheel = !showRemountWheel)}
>
  Toggle wheel
</button>
{#if showRemountWheel}
  <NumberField.Root allowWheel aria-label="Remount wheel" defaultValue={1}>
    <NumberField.Group><NumberField.Input data-testid="remount-wheel-number" /></NumberField.Group>
  </NumberField.Root>
{/if}

<output data-testid="number-state">{value}:{changes}:{inputRef?.tagName ?? "missing"}</output>
<output data-testid="delegate-ref">{delegatedRef?.dataset.slot ?? "missing"}</output>
