<script lang="ts">
import * as Fieldset from "./index.js";
</script>

<Fieldset.Root disabled>
  <Fieldset.Legend id="preferences-legend">Preferences</Fieldset.Legend>
  <Fieldset.Root data-testid="nested-fieldset">
    <Fieldset.Legend id="nested-legend">
      {#snippet children(state)}
        Nested <span data-testid="nested-legend-state">{String(state.disabled)}</span>
      {/snippet}
    </Fieldset.Legend>
    <input name="updates" type="checkbox">
  </Fieldset.Root>
</Fieldset.Root>
