<script lang="ts">
import * as NumberField from "./index.js";

let value = $state<number | null>(1.5);
let changes = $state(0);
let inputRef = $state<HTMLInputElement | null>(null);
</script>

<form data-testid="number-form" onsubmit={(event) => event.preventDefault()}>
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

<output data-testid="number-state">{value}:{changes}:{inputRef?.tagName ?? "missing"}</output>
