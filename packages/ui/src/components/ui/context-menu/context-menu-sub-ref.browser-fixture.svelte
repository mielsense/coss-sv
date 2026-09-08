<script lang="ts">
  import * as Menu from "./index.js";
  let ref = $state<HTMLElement | null>(null);
  let visible = $state(true);
</script>

{#if visible}
  <Menu.Root defaultOpen>
    <Menu.Trigger>Open context menu</Menu.Trigger>
    <Menu.Popup>
      <Menu.Sub defaultOpen>
        <Menu.SubTrigger>More</Menu.SubTrigger>
        <Menu.SubPopup bind:ref><Menu.Item>Nested item</Menu.Item></Menu.SubPopup>
      </Menu.Sub>
    </Menu.Popup>
  </Menu.Root>
{/if}
<button data-testid="remove-menu" onclick={() => (visible = false)}>Remove menu</button>
<output data-testid="sub-ref">{ref?.getAttribute("role") ?? "null"}</output>
