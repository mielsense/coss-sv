<script lang="ts">
  import { tick } from "svelte";
  import * as Field from "../field/index.js";
  import * as NumberField from "./index.js";

  let value = $state<number | null>(1.5);
  let changes = $state(0);
  let inputRef = $state<HTMLInputElement | null>(null);
  let delegatedRef = $state<HTMLDivElement | null>(null);
  let cursorRef = $state<SVGSVGElement | null>(null);
  let showRemountWheel = $state(true);
  let showFieldError = $state(false);
  let reactiveDescription = $state<string | null | undefined>(null);
  let showReactiveNumber = $state(true);
  const removedNumberAria = {
    "aria-describedby": null,
    "aria-labelledby": null,
    "aria-valuemax": null,
    "aria-valuemin": null,
    "aria-valuenow": null,
    "aria-valuetext": null,
  } satisfies NumberField.NumberFieldInputProps;

  async function raceReactiveDescription(): Promise<void> {
    reactiveDescription = null;
    await tick();
    reactiveDescription = undefined;
    await tick();
    reactiveDescription = "reactive-number-external";
    await tick();
  }
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

<NumberField.Root defaultValue={5} max={10} min={0}>
  <NumberField.Group><NumberField.Input data-testid="unnamed-number" /></NumberField.Group>
</NumberField.Root>

<label for="currency-field">Price</label>
<NumberField.Root
  defaultValue={12.5}
  format={{ currency: "USD", style: "currency" }}
  id="currency-field"
  max={100}
  min={0}
>
  <NumberField.Group><NumberField.Input data-testid="currency-number" /></NumberField.Group>
</NumberField.Root>

<NumberField.Root aria-label="Empty number" max={10} min={-10}>
  <NumberField.Group><NumberField.Input data-testid="empty-number" /></NumberField.Group>
</NumberField.Root>

<NumberField.Root aria-label="Root fallback" defaultValue={2} max={4} min={1}>
  <NumberField.Group>
    <NumberField.Input
      aria-label="Input override"
      aria-valuemax={8}
      aria-valuemin={-8}
      aria-valuenow={6}
      aria-valuetext="Six widgets"
      data-testid="overridden-number"
    />
  </NumberField.Group>
</NumberField.Root>

<Field.Root invalid={showFieldError}>
  <Field.Label>Field quantity</Field.Label>
  <span id="field-number-external-description">External field quantity description</span>
  <NumberField.Root defaultValue={4} max={10} min={1}>
    <NumberField.Group>
      <NumberField.Input
        aria-describedby="field-number-external-description"
        data-testid="field-number-input"
      />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description>Field quantity description</Field.Description>
  <Field.Error match={showFieldError}>Field quantity error</Field.Error>
</Field.Root>
<button
  data-testid="toggle-field-error"
  type="button"
  onclick={() => (showFieldError = !showFieldError)}
>
  Toggle field error
</button>

<Field.Root>
  <NumberField.Root defaultValue={2} max={100} min={1}>
    <NumberField.ScrubArea label="Scrub quantity" />
    <NumberField.Group>
      <NumberField.Input data-testid="field-scrub-number-input" />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description>Scrub quantity description</Field.Description>
</Field.Root>

<p id="reactive-number-external">Reactive external number description</p>
<Field.Root>
  <Field.Label>Reactive number label</Field.Label>
  <NumberField.Root defaultValue={2} max={4} min={1}>
    <NumberField.Group>
      {#if showReactiveNumber}
        <NumberField.Input
          aria-describedby={reactiveDescription}
          data-testid="reactive-aria-number"
        />
      {/if}
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description id="reactive-number-field-description">
    Reactive field number description
  </Field.Description>
</Field.Root>
<button
  data-testid="number-description-inherit"
  type="button"
  onclick={() => (reactiveDescription = undefined)}
>
  Inherit number description
</button>
<button
  data-testid="number-description-external"
  type="button"
  onclick={() => (reactiveDescription = "reactive-number-external")}
>
  Merge number description
</button>
<button
  data-testid="number-description-remove"
  type="button"
  onclick={() => (reactiveDescription = null)}
>
  Remove number description
</button>
<button data-testid="number-description-race" type="button" onclick={raceReactiveDescription}>
  Race number description
</button>
<button
  data-testid="number-description-mount"
  type="button"
  onclick={() => (showReactiveNumber = !showReactiveNumber)}
>
  Toggle reactive number
</button>

<Field.Root>
  <Field.Label id="root-number-label">Root number label</Field.Label>
  <NumberField.Root
    aria-describedby="root-number-description"
    aria-labelledby="root-number-label"
    defaultValue={2}
    max={4}
    min={1}
  >
    <NumberField.Group>
      <NumberField.Input {...removedNumberAria} data-testid="null-aria-number" />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description id="root-number-description">Root number description</Field.Description>
</Field.Root>

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
<NumberField.CursorGrowIcon
  bind:ref={cursorRef}
  class={["cursor-base", { "cursor-active": true }]}
  data-testid="cursor-grow-icon"
/>
<output data-testid="cursor-grow-ref">{cursorRef?.tagName ?? "missing"}</output>
