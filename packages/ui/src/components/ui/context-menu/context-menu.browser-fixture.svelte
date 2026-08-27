<script lang="ts">
import * as ContextMenu from "./index.js";

let open = $state(false);
</script>

<button data-testid="before" type="button">Before</button>
<ContextMenu.Root bind:open>
  <ContextMenu.Trigger class="size-40" data-testid="surface">Right click here</ContextMenu.Trigger>
  <ContextMenu.Popup>
    <ContextMenu.Item data-testid="action">Action</ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger data-testid="share" openOnHover={false}>Share</ContextMenu.SubTrigger>
      <ContextMenu.SubPopup
        ><ContextMenu.Item data-testid="email">Email</ContextMenu.Item></ContextMenu.SubPopup
      >
    </ContextMenu.Sub>
  </ContextMenu.Popup>
</ContextMenu.Root>
<output data-testid="open">{open ? "open" : "closed"}</output>
