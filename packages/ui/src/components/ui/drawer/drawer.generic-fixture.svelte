<script lang="ts">
import * as Drawer from "./index.js";
import { Drawer as NamedRoot, DrawerHandle, DrawerTrigger } from "./index.js";
const handle = Drawer.createHandle<{ id: number }>();
const namedHandle = new DrawerHandle<{ id: number }>();
</script>

<Drawer.Trigger {handle} payload={{ id: 1 }}>Open typed drawer</Drawer.Trigger>
<Drawer.Root {handle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</Drawer.Root>
<DrawerTrigger handle={namedHandle} payload={{ id: 2 }}>Open named drawer</DrawerTrigger>
<NamedRoot handle={namedHandle}>
  {#snippet children({ payload })}
    {payload?.id}
  {/snippet}
</NamedRoot>
