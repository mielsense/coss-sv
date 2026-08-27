<script lang="ts">
import * as Field from "../field/index.js";
import * as OTPField from "./index.js";
</script>

<Field.Root>
  <Field.Label id="hydrated-security-label">Security code</Field.Label>
  <OTPField.Root length={2}>
    <OTPField.Input data-testid="hydrated-security-first" />
    <OTPField.Input aria-label="Security character 2" />
  </OTPField.Root>
  <Field.Description id="hydrated-security-description"> Enter both characters. </Field.Description>
</Field.Root>
