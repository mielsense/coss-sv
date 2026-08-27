<script lang="ts">
import * as Sheet from "./index.js";
import { Sheet as NamedRoot, SheetHandle, SheetTrigger } from "./index.js";
const handle = Sheet.createHandle<{ id: number }>();
const namedHandle = new SheetHandle<{ id: number }>();
</script>

<Sheet.Trigger {handle} payload={{ id: 1 }}>Open typed sheet</Sheet.Trigger>
<Sheet.Root {handle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</Sheet.Root>
<SheetTrigger handle={namedHandle} payload={{ id: 2 }}>Open named sheet</SheetTrigger>
<NamedRoot handle={namedHandle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</NamedRoot>
