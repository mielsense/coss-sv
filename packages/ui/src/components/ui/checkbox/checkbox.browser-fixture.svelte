<script lang="ts">
import Checkbox from "./checkbox.svelte";

let checked = $state(false);
let callbackValue = $state("none");
let checkboxRef = $state<HTMLElement | null>(null);
</script>

<form data-testid="checkbox-form" onsubmit={(event) => event.preventDefault()}>
  <Checkbox
    bind:checked
    bind:ref={checkboxRef}
    data-testid="checkbox"
    id="fixture-checkbox"
    name="terms"
    onCheckedChange={(next) => (callbackValue = String(next))}
    required
    value="yes"
  />
  <label for="fixture-checkbox">Accept terms</label>
  <Checkbox aria-label="Indeterminate" data-testid="indeterminate" indeterminate />
  <Checkbox aria-label="Disabled" data-testid="disabled" disabled />
  <button type="submit">Submit</button>
</form>

<output data-testid="checkbox-state"
  >{checked}:{callbackValue}:{checkboxRef?.tagName ?? "missing"}</output
>
