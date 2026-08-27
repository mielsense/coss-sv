<script lang="ts">
import { NumberField } from "@coss-sv/ui";

let controlled = $state<number | null>(25);
</script>

<div class="fixture">
  <section data-particle="p-number-field-1">
    <NumberField.Root defaultValue={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-2">
    <NumberField.Root defaultValue={0} size="sm">
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-3">
    <NumberField.Root defaultValue={0} size="lg">
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-4">
    <NumberField.Root defaultValue={42} disabled>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input aria-label="Disabled quantity" />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-5">
    <div class="flex flex-col items-start gap-2">
      <label for="parity-quantity">Quantity</label>
      <NumberField.Root defaultValue={0} id="parity-quantity">
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>
    </div>
  </section>

  <section data-particle="p-number-field-6">
    <NumberField.Root defaultValue={0}>
      <NumberField.ScrubArea label="Quantity" />
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-7">
    <NumberField.Root defaultValue={5} max={10} min={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-8">
    <NumberField.Root defaultValue={0} format={{ currency: "USD", style: "currency" }}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-review-probes="number-field">
    <NumberField.Root bind:value={controlled} aria-label="Controlled quantity" max={150} min={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input data-testid="controlled-number" />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
    <output data-testid="controlled-number-state">{controlled}</output>
  </section>
</div>

<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 3rem 2rem;
  padding: 2rem;
}
.fixture section {
  display: flex;
  width: min(16rem, 100%);
  min-width: 0;
  align-items: center;
  justify-content: center;
}
[data-review-probes="number-field"] {
  flex-direction: column;
  gap: 0.5rem;
}
@media (max-width: 639px) {
  .fixture {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    padding: 1.5rem;
  }
}
</style>
