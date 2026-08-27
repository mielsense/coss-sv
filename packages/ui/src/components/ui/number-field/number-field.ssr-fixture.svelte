<script lang="ts">
import * as NumberField from "./index.js";
</script>

<NumberField.Root defaultValue={2}>
  <NumberField.ScrubArea label="Quantity" />
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input aria-label="Quantity" />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
