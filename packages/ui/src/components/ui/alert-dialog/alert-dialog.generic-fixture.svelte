<script lang="ts">
  import * as AlertDialog from "./index.js";
  import { AlertDialog as NamedRoot, AlertDialogHandle, AlertDialogTrigger } from "./index.js";
  const handle = AlertDialog.createHandle<{ id: number }>();
  const namedHandle = new AlertDialogHandle<{ id: number }>();
</script>

<AlertDialog.Trigger {handle} payload={{ id: 1 }}>Open typed alert</AlertDialog.Trigger>
<AlertDialog.Root {handle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</AlertDialog.Root>
<AlertDialogTrigger handle={namedHandle} payload={{ id: 2 }}>Open named alert</AlertDialogTrigger>
<NamedRoot handle={namedHandle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</NamedRoot>
