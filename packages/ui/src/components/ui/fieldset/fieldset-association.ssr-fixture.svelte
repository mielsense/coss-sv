<script lang="ts">
  import * as Fieldset from "./index.js";
</script>

<Fieldset.Root data-testid="fieldset-without-legend" />

<Fieldset.Root data-testid="fieldset-with-custom-legend">
  <Fieldset.Legend id="custom-fieldset-legend" data-testid="custom-fieldset-legend">
    Custom legend
  </Fieldset.Legend>
</Fieldset.Root>
