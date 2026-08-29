<script lang="ts">
  import * as Field from "./index.js";
</script>

<Field.Root name="account" invalid>
  <Field.Label id="account-label" for="account-name">Account name</Field.Label>
  <Field.Item>
    <Field.Control id="account-name" aria-describedby="account-help account-error" value="miel" />
  </Field.Item>
  <Field.Description id="account-help">Used on your public profile.</Field.Description>
  <Field.Error id="account-error" match={true}>Choose another account name.</Field.Error>
</Field.Root>
