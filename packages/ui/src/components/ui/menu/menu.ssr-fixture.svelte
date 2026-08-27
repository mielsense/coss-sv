<script lang="ts">
import * as Menu from "./index.js";
</script>

<Menu.Root defaultOpen>
  <Menu.Trigger>Open menu</Menu.Trigger>
  <Menu.Popup class="custom-popup" id="ssr-menu-popup">
    <Menu.Group>
      <Menu.Label inset>Playback</Menu.Label>
      <Menu.Item inset>Play <Menu.Shortcut>⌘P</Menu.Shortcut></Menu.Item>
      <Menu.Item disabled variant="destructive">Delete</Menu.Item>
    </Menu.Group>
    <Menu.Separator />
    <Menu.CheckboxItem defaultChecked>Shuffle</Menu.CheckboxItem>
    <Menu.CheckboxItem defaultChecked variant="switch">Auto save</Menu.CheckboxItem>
    <Menu.RadioGroup defaultValue="system">
      <Menu.RadioItem value="system">System</Menu.RadioItem>
    </Menu.RadioGroup>
    <Menu.Sub defaultOpen>
      <Menu.SubTrigger>More</Menu.SubTrigger>
      <Menu.SubPopup id="ssr-menu-sub-popup"><Menu.Item>Nested item</Menu.Item></Menu.SubPopup>
    </Menu.Sub>
  </Menu.Popup>
</Menu.Root>
