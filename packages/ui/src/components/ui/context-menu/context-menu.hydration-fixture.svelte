<script lang="ts">
import * as ContextMenu from "./index.js";
</script>

<ContextMenu.Root defaultOpen>
  <ContextMenu.Trigger>Hydrated context target</ContextMenu.Trigger>
  <ContextMenu.Popup id="custom-popup">
    <ContextMenu.Item>Hydrated action</ContextMenu.Item>
  </ContextMenu.Popup>
</ContextMenu.Root>
