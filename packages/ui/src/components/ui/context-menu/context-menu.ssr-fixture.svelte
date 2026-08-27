<script lang="ts">
import * as ContextMenu from "./index.js";
</script>

<ContextMenu.Root defaultOpen>
  <ContextMenu.Trigger class="surface">Right click here</ContextMenu.Trigger>
  <ContextMenu.Popup>
    <ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
    <ContextMenu.CheckboxItem defaultChecked>Show hidden files</ContextMenu.CheckboxItem>
    <ContextMenu.RadioGroup defaultValue="system">
      <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
    <ContextMenu.Sub defaultOpen>
      <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
      <ContextMenu.SubPopup><ContextMenu.Item>Email link</ContextMenu.Item></ContextMenu.SubPopup>
    </ContextMenu.Sub>
  </ContextMenu.Popup>
</ContextMenu.Root>
