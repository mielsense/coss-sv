<script lang="ts">
import * as Menu from "./index.js";

let { defaultOpen = false }: { defaultOpen?: boolean } = $props();
</script>

<Menu.Root {defaultOpen}>
  <Menu.Trigger>Default menu</Menu.Trigger>
  <Menu.Popup><Menu.Item>Default item</Menu.Item></Menu.Popup>
</Menu.Root>
