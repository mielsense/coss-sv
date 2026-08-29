<script lang="ts">
  import * as Menu from "./index.js";

  type Payload = { label: string };

  const detached = new Menu.Handle<Payload>();
  const orphan = new Menu.Handle<Payload>();
  let detachedOpen = $state(false);
  let attachedOpen = $state(false);
  let portalTarget = $state<HTMLElement | null>(null);
</script>

<Menu.Trigger data-testid="orphan-trigger" handle={orphan} payload={{ label: "Orphan" }}>
  Orphan
</Menu.Trigger>

<Menu.Trigger
  data-testid="detached-a"
  handle={detached}
  id="detached-a"
  payload={{ label: "Alpha" }}
>
  Alpha actions
</Menu.Trigger>
<Menu.Trigger
  data-testid="detached-b"
  handle={detached}
  id="detached-b"
  payload={{ label: "Beta" }}
>
  Beta actions
</Menu.Trigger>
<Menu.Root bind:open={detachedOpen} handle={detached}>
  {#snippet children({ payload })}
    <Menu.Popup id="detached-popup">
      <Menu.Item data-testid="detached-payload">{payload?.label}</Menu.Item>
    </Menu.Popup>
  {/snippet}
</Menu.Root>
<output data-testid="detached-open">{detachedOpen ? "open" : "closed"}</output>

<div bind:this={portalTarget} data-testid="portal-target"></div>
<Menu.Root bind:open={attachedOpen}>
  <Menu.Trigger data-testid="attached-a" id="attached-a">Attached A</Menu.Trigger>
  <Menu.Trigger data-testid="attached-b" id="attached-b">Attached B</Menu.Trigger>
  <Menu.Popup id="explicit-popup" portalProps={{ container: portalTarget, keepMounted: true }}>
    <Menu.Item>First</Menu.Item>
    <Menu.Sub>
      <Menu.SubTrigger data-testid="deep-one" openOnHover={false}>More</Menu.SubTrigger>
      <Menu.SubPopup id="explicit-sub-popup">
        <Menu.Item>Second</Menu.Item>
        <Menu.Sub>
          <Menu.SubTrigger data-testid="deep-two" openOnHover={false}>Deeper</Menu.SubTrigger>
          <Menu.SubPopup id="explicit-deep-popup">
            <Menu.Item data-testid="deep-item">Deep item</Menu.Item>
          </Menu.SubPopup>
        </Menu.Sub>
      </Menu.SubPopup>
    </Menu.Sub>
  </Menu.Popup>
</Menu.Root>
<output data-testid="attached-open">{attachedOpen ? "open" : "closed"}</output>
