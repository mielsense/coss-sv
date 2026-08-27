<script lang="ts">
import * as Field from "../field/index.js";
import Input from "../input/input.svelte";
import * as Fieldset from "./index.js";

let outerDisabled = $state(true);
</script>

<button
  data-testid="toggle-outer-disabled"
  onclick={() => (outerDisabled = !outerDisabled)}
  type="button"
>
  Toggle disabled
</button>

<Fieldset.Root disabled={outerDisabled} data-testid="outer-fieldset">
  <Fieldset.Legend data-testid="outer-legend">Account</Fieldset.Legend>
  <Field.Root>
    <Field.Label>Email</Field.Label>
    <Input data-testid="disabled-control" />
  </Field.Root>
  <Fieldset.Root data-testid="inner-fieldset">
    <Fieldset.Legend data-testid="inner-legend">
      {#snippet children(state)}
        Nested <span data-testid="inner-legend-state">{String(state.disabled)}</span>
      {/snippet}
    </Fieldset.Legend>
    <input data-testid="native-disabled-control">
  </Fieldset.Root>
</Fieldset.Root>
