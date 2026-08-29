<script lang="ts">
  import * as Fieldset from "../fieldset/index.js";
  import * as Field from "./index.js";
</script>

<Field.Root as="fieldset" data-testid="field-without-legend" />

<Field.Root as="fieldset" data-testid="field-with-custom-legend">
  <Fieldset.Legend id="custom-field-legend" data-testid="custom-field-legend">
    Custom legend
  </Fieldset.Legend>
</Field.Root>
