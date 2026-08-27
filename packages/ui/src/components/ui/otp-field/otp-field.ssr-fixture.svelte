<script lang="ts">
import * as OTPField from "./index.js";
</script>

<OTPField.Root aria-label="Verification code" form="verification-form" length={2}>
  <OTPField.Input />
  <OTPField.Separator />
  <OTPField.Input aria-label="Character 2 of 2" />
</OTPField.Root>
