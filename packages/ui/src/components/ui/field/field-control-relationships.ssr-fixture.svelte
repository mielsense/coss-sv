<script lang="ts">
  import * as Field from "./index.js";
</script>

<Field.Root>
  <Field.Label data-testid="default-control-label">Default control</Field.Label>
  <Field.Control data-testid="default-control" />
</Field.Root>

<Field.Root>
  <Field.Item>
    <Field.Label data-testid="default-item-control-label">Default item control</Field.Label>
    <Field.Control data-testid="default-item-control" />
  </Field.Item>
</Field.Root>

<Field.Root controlId="explicit-root-control">
  <Field.Label data-testid="explicit-root-control-label">Explicit root control</Field.Label>
  <Field.Control data-testid="explicit-root-control" id="explicit-root-control" />
</Field.Root>

<Field.Root>
  <Field.Item controlId="explicit-item-control">
    <Field.Label data-testid="explicit-item-control-label">Explicit item control</Field.Label>
    <Field.Control data-testid="explicit-item-control" id="explicit-item-control" />
  </Field.Item>
</Field.Root>
