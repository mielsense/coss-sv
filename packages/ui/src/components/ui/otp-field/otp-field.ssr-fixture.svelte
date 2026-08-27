<script lang="ts">
import * as Field from "../field/index.js";
import * as OTPField from "./index.js";
</script>

<OTPField.Root aria-label="Verification code" form="verification-form" length={2}>
  <OTPField.Input />
  <OTPField.Separator />
  <OTPField.Input aria-label="Character 2 of 2" />
</OTPField.Root>

<Field.Root>
  <Field.Label id="ssr-security-label">Security code</Field.Label>
  <OTPField.Root length={2}>
    <OTPField.Input />
    <OTPField.Input aria-label="Security character 2" />
  </OTPField.Root>
  <Field.Description id="ssr-security-description">Enter both characters.</Field.Description>
</Field.Root>
