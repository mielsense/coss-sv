<script lang="ts">
import * as ContextMenu from "./index.js";
</script>

<ContextMenu.Root defaultOpen>
  <ContextMenu.Trigger class="surface">Right click here</ContextMenu.Trigger>
  <ContextMenu.Popup id="custom-popup">
    <ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
    <ContextMenu.CheckboxItem defaultChecked>Show hidden files</ContextMenu.CheckboxItem>
    <ContextMenu.RadioGroup defaultValue="system">
      <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
    <ContextMenu.Sub defaultOpen>
      <ContextMenu.SubTrigger id="explicit-sub-trigger">Share</ContextMenu.SubTrigger>
      <ContextMenu.SubPopup id="sub-a">
        <ContextMenu.Item>Email link</ContextMenu.Item>
        <ContextMenu.Sub defaultOpen>
          <ContextMenu.SubTrigger id="nested-sub-trigger">More</ContextMenu.SubTrigger>
          <ContextMenu.SubPopup id="sub-a-nested">
            <ContextMenu.Item>Copy link</ContextMenu.Item>
          </ContextMenu.SubPopup>
        </ContextMenu.Sub>
      </ContextMenu.SubPopup>
    </ContextMenu.Sub>
    <ContextMenu.Sub defaultOpen>
      <ContextMenu.SubTrigger id="generated-sub-trigger">Open with</ContextMenu.SubTrigger>
      <ContextMenu.SubPopup>
        <ContextMenu.Item>Text editor</ContextMenu.Item>
      </ContextMenu.SubPopup>
    </ContextMenu.Sub>
    <ContextMenu.Sub defaultOpen>
      <ContextMenu.SubTrigger aria-controls="consumer-sub-popup" id="override-sub-trigger"
        >Export</ContextMenu.SubTrigger
      >
      <ContextMenu.SubPopup id="actual-export-popup">
        <ContextMenu.Item>PDF</ContextMenu.Item>
      </ContextMenu.SubPopup>
    </ContextMenu.Sub>
  </ContextMenu.Popup>
</ContextMenu.Root>

<ContextMenu.Root open>
  <ContextMenu.Trigger>Controlled context target</ContextMenu.Trigger>
  <ContextMenu.Popup id="controlled-popup">
    <ContextMenu.Item>Controlled action</ContextMenu.Item>
  </ContextMenu.Popup>
</ContextMenu.Root>
