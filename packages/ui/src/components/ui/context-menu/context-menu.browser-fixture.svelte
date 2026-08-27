<script lang="ts">
import * as ContextMenu from "./index.js";

let open = $state(false);
let portalTarget = $state<HTMLElement | null>(null);
</script>

<button data-testid="before" type="button">Before</button>
<div bind:this={portalTarget} data-testid="portal-target"></div>
<ContextMenu.Root bind:open>
  <ContextMenu.Trigger class="size-40" data-testid="surface" tabindex={0}
    >Right click here</ContextMenu.Trigger
  >
  <ContextMenu.Popup
    id="context-popup"
    portalProps={{ container: portalTarget, keepMounted: true }}
  >
    <ContextMenu.Item data-testid="action">Action</ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger data-testid="share" openOnHover={false}>Share</ContextMenu.SubTrigger>
      <ContextMenu.SubPopup id="context-sub-popup">
        <ContextMenu.Item data-testid="email">Email</ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger data-testid="deep-share" openOnHover={false}
            >More</ContextMenu.SubTrigger
          >
          <ContextMenu.SubPopup id="context-deep-popup">
            <ContextMenu.Item data-testid="deep-action">Deep action</ContextMenu.Item>
          </ContextMenu.SubPopup>
        </ContextMenu.Sub>
      </ContextMenu.SubPopup>
    </ContextMenu.Sub>
  </ContextMenu.Popup>
</ContextMenu.Root>
<output data-testid="open">{open ? "open" : "closed"}</output>
