<script lang="ts">
  import * as Fieldset from "../fieldset/index.js";
  import * as Field from "./index.js";

  const uid = $props.id();
  const legendId = `${uid}-legend`;
</script>

<Field.Root as="fieldset" data-testid="generated-fieldset" {legendId}>
  <Fieldset.Legend id={legendId} data-testid="generated-legend">Preferences</Fieldset.Legend>
</Field.Root>
