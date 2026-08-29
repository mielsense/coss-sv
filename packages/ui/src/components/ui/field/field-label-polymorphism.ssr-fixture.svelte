<script lang="ts">
  import * as Field from "./index.js";
</script>

<Field.Root>
  <Field.Label as="span" data-testid="root-span-label">Root span label</Field.Label>
  <Field.Control data-testid="root-span-control" />
</Field.Root>

<Field.Root>
  <Field.Item>
    <Field.Label as="span" data-testid="item-span-label">Item span label</Field.Label>
    <Field.Control data-testid="item-span-control" />
  </Field.Item>
</Field.Root>

<Field.Root>
  <Field.Label data-testid="explicit-label" for="consumer-control">Explicit label</Field.Label>
  <Field.Control data-testid="registered-control" />
  <input id="consumer-control" />
</Field.Root>

<Field.Root>
  <Field.Label as="span" data-testid="explicit-span-label" for="consumer-span-control">
    Explicit span label
  </Field.Label>
  <Field.Control data-testid="registered-span-control" />
  <input id="consumer-span-control" />
</Field.Root>
