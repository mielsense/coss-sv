<script lang="ts">
  import * as ContextMenu from "./index.js";
</script>

<ContextMenu.Root defaultOpen>
  <ContextMenu.Trigger>Hydrated context target</ContextMenu.Trigger>
  <ContextMenu.Popup id="custom-popup">
    <ContextMenu.Item>Hydrated action</ContextMenu.Item>
    <ContextMenu.Sub defaultOpen>
      <ContextMenu.SubTrigger
        data-testid="hydrated-explicit-sub-trigger"
        id="hydrated-explicit-sub-trigger">Explicit submenu</ContextMenu.SubTrigger
      >
      <ContextMenu.SubPopup id="hydrated-explicit-sub-popup">
        <ContextMenu.Item>Explicit submenu action</ContextMenu.Item>
        <ContextMenu.Sub defaultOpen>
          <ContextMenu.SubTrigger
            data-testid="hydrated-nested-sub-trigger"
            id="hydrated-nested-sub-trigger">Nested submenu</ContextMenu.SubTrigger
          >
          <ContextMenu.SubPopup id="hydrated-nested-sub-popup">
            <ContextMenu.Item>Nested submenu action</ContextMenu.Item>
            <ContextMenu.Sub defaultOpen>
              <ContextMenu.SubTrigger
                data-testid="hydrated-generated-sub-trigger"
                id="hydrated-generated-sub-trigger">Generated submenu</ContextMenu.SubTrigger
              >
              <ContextMenu.SubPopup>
                <ContextMenu.Item>Generated submenu action</ContextMenu.Item>
              </ContextMenu.SubPopup>
            </ContextMenu.Sub>
          </ContextMenu.SubPopup>
        </ContextMenu.Sub>
      </ContextMenu.SubPopup>
    </ContextMenu.Sub>
  </ContextMenu.Popup>
</ContextMenu.Root>
