<script lang="ts">
import * as NumberField from "./index.js";
</script>

{#snippet group(props: NumberField.NumberFieldGroupProps)}
  <NumberField.Group {...props} />
{/snippet}

<NumberField.Root defaultValue={2}>
  <NumberField.ScrubArea label="Quantity" />
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input aria-label="Quantity" />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>

<NumberField.Root aria-label="Delegated quantity" delegate={group}>
  <NumberField.Input />
</NumberField.Root>
