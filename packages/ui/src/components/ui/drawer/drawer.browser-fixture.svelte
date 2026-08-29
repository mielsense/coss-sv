<script lang="ts">
  import DrawerCase from "./drawer-browser-case.svelte";
  import * as Drawer from "./index.js";
  import Button from "../button/button.svelte";
  import * as Field from "../field/index.js";
  import Input from "../input/input.svelte";
  const positions = ["bottom", "top", "left", "right"] as const;
  const detached = Drawer.createHandle<{ label: string }>();
</script>

{#each positions as position}
  <DrawerCase {position} />
{/each}
<Drawer.Root modal={false}
  ><Drawer.SwipeArea data-testid="edge-swipe" />
  <Drawer.Popup
    ><Drawer.Header
      ><Drawer.Title>Edge drawer</Drawer.Title><Drawer.Description
        >Non-modal drawer.</Drawer.Description
      ></Drawer.Header
    ></Drawer.Popup
  ></Drawer.Root
>
<Drawer.Root>
  <Drawer.Trigger>Open menu defaults</Drawer.Trigger>
  <Drawer.Popup>
    <Drawer.Title>Menu defaults</Drawer.Title>
    <Drawer.Description>Default menu state.</Drawer.Description>
    <Drawer.Menu>
      <Drawer.MenuCheckboxItem defaultChecked>Shuffle</Drawer.MenuCheckboxItem>
      <Drawer.MenuRadioGroup aria-label="Sort by" defaultValue="artist">
        <Drawer.MenuRadioItem value="artist">Artist</Drawer.MenuRadioItem>
        <Drawer.MenuRadioItem value="album">Album</Drawer.MenuRadioItem>
      </Drawer.MenuRadioGroup>
    </Drawer.Menu>
  </Drawer.Popup>
</Drawer.Root>
<Drawer.Root position="right">
  <Drawer.Trigger>Open exact nested inset</Drawer.Trigger>
  <Drawer.Popup variant="inset">
    <Drawer.Header>
      <Drawer.Title>Exact member</Drawer.Title>
      <Drawer.Description>Member details.</Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer>
      <Drawer.Root position="right">
        <Drawer.Trigger>Edit exact details</Drawer.Trigger>
        <Drawer.Popup variant="inset">
          {const member = $state({ email: "bora@example.com", name: "Bora Baloglu" })}
          <Drawer.Header>
            <Drawer.Title>Edit exact details</Drawer.Title>
            <Drawer.Description>Edit member details.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Panel>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input bind:value={member.name} defaultValue="Bora Baloglu" type="text" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input bind:value={member.email} defaultValue="bora@example.com" type="email" />
            </Field.Root>
          </Drawer.Panel>
          <Drawer.Footer>
            <Drawer.Close>Cancel exact edit</Drawer.Close>
            <Button>Save exact edit</Button>
          </Drawer.Footer>
        </Drawer.Popup>
      </Drawer.Root>
    </Drawer.Footer>
  </Drawer.Popup>
</Drawer.Root>
<Drawer.Trigger handle={detached} payload={{ label: "Detached drawer payload" }}>
  Open detached drawer
</Drawer.Trigger>
<Drawer.Root handle={detached}>
  {#snippet children({ payload })}
    <Drawer.Popup showCloseButton>
      <Drawer.Title>Detached drawer</Drawer.Title>
      <Drawer.Description>{payload?.label}</Drawer.Description>
      <Drawer.Close>Close detached drawer</Drawer.Close>
    </Drawer.Popup>
  {/snippet}
</Drawer.Root>

<style>
  :global([data-slot="drawer-backdrop"]),
  :global([data-slot="drawer-viewport"]) {
    position: fixed;
    inset: 0;
    z-index: 50;
  }
  :global([data-slot="drawer-popup"]) {
    position: relative;
    z-index: 1;
  }
  :global([data-testid="bottom-drawer"][data-nested-drawer-open]) {
    transform: scale(
      clamp(
        0,
        calc(
          max(0, 1 - (var(--nested-drawers) * 0.05)) +
            (0.05 * clamp(0, var(--drawer-swipe-progress, 0), 1))
        ),
        1
      )
    );
  }
</style>
