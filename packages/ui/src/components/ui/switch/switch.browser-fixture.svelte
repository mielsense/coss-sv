<script lang="ts">
  import Switch from "./switch.svelte";

  let checked = $state(false);
  let callbackValue = $state("none");
  let switchRef = $state<HTMLElement | null>(null);
</script>

<form data-testid="switch-form" onsubmit={(event) => event.preventDefault()}>
  <Switch
    bind:checked
    bind:ref={switchRef}
    data-testid="switch"
    id="fixture-switch"
    name="marketing"
    onCheckedChange={(next) => (callbackValue = String(next))}
    required
    value="yes"
  />
  <label for="fixture-switch">Marketing emails</label>
  <Switch aria-label="Controlled on" checked data-testid="controlled-on" />
  <Switch aria-label="Default on" data-testid="default-on" defaultChecked />
  <Switch
    aria-label="Canceled switch"
    data-testid="canceled"
    onCheckedChange={(_next, details) => {
      details.allowPropagation();
      details.cancel();
      callbackValue = `${details.reason}:${details.event.type}:${details.isPropagationAllowed}`;
    }}
  />
  <Switch aria-label="Disabled" data-testid="disabled" disabled />
  <button type="submit">Submit</button>
</form>

<output data-testid="switch-state"
  >{checked}:{callbackValue}:{switchRef?.tagName ?? "missing"}</output
>
