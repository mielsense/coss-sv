<script lang="ts">
  import * as Dialog from "./index.js";
  import { Dialog as NamedRoot, DialogHandle, DialogTrigger } from "./index.js";
  const handle = Dialog.createHandle<{ id: number }>();
  const namedHandle = new DialogHandle<{ id: number }>();
</script>

<Dialog.Trigger {handle} payload={{ id: 1 }}>Open typed dialog</Dialog.Trigger>
<Dialog.Root {handle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</Dialog.Root>
<DialogTrigger handle={namedHandle} payload={{ id: 2 }}>Open named dialog</DialogTrigger>
<NamedRoot handle={namedHandle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</NamedRoot>
