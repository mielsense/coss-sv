<script lang="ts">
  import * as Fieldset from "./index.js";

  const uid = $props.id();
  const nestedLegendId = `${uid}-nested-legend`;
</script>

<Fieldset.Root disabled legendId="preferences-legend">
  <Fieldset.Legend id="preferences-legend">Preferences</Fieldset.Legend>
  <Fieldset.Root data-testid="nested-fieldset" legendId={nestedLegendId}>
    <Fieldset.Legend id={nestedLegendId} data-testid="nested-legend">
      {#snippet children(state)}
        Nested <span data-testid="nested-legend-state">{String(state.disabled)}</span>
      {/snippet}
    </Fieldset.Legend>
    <input name="updates" type="checkbox" />
  </Fieldset.Root>
</Fieldset.Root>
