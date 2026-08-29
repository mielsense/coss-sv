<script lang="ts">
  import * as Collapsible from "./index.js";

  let { defaultOpen = false }: { defaultOpen?: boolean } = $props();
</script>

<Collapsible.Root {defaultOpen}>
  <Collapsible.Trigger>Default collapsible</Collapsible.Trigger>
  <Collapsible.Panel keepMounted>Default collapsible content</Collapsible.Panel>
</Collapsible.Root>
