<script lang="ts">
import * as Fieldset from "../fieldset/index.js";
import Input from "../input/input.svelte";
import * as Field from "./index.js";
</script>

<Field.Root as="fieldset" class="gap-4" disabled name="frameworks">
  <Fieldset.Legend id="frameworks-legend" class="font-medium text-sm">Frameworks</Fieldset.Legend>
  <Field.Item>
    <Field.Label>React <Input name="choice" value="react" /></Field.Label>
  </Field.Item>
</Field.Root>
