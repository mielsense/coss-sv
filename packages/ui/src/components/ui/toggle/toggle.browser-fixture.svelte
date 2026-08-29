<script lang="ts">
  import Toggle from "./toggle.svelte";

  let callbackValues = $state<boolean[]>([]);
  let controlled = $state(false);
  let controlledWrites = $state(0);
  let disabledChanges = $state(0);
  let pressed = $state(false);
  let toggleRef = $state<HTMLElement | null>(null);
</script>

<Toggle
  aria-label="Standalone toggle"
  bind:pressed
  bind:ref={toggleRef}
  data-testid="standalone-toggle"
  onPressedChange={(next) => callbackValues.push(next)}
>
  Standalone
</Toggle>

<Toggle
  aria-label="Disabled toggle"
  data-testid="disabled-toggle"
  disabled
  onPressedChange={() => (disabledChanges += 1)}
>
  Disabled
</Toggle>

<Toggle as="span" aria-label="Polymorphic toggle" data-testid="polymorphic-toggle">
  Polymorphic
</Toggle>

<Toggle
  aria-label="Declined toggle"
  bind:pressed={() => controlled, () => (controlledWrites += 1)}
  data-testid="declined-toggle"
  onPressedChange={(next) => callbackValues.push(next)}
>
  Declined
</Toggle>

<output data-testid="standalone-state">{pressed}:{toggleRef?.tagName ?? "missing"}</output>
<output data-testid="callback-values">{callbackValues.join(",")}</output>
<output data-testid="disabled-changes">{disabledChanges}</output>
<output data-testid="controlled-writes">{controlledWrites}</output>
