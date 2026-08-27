<script lang="ts">
import { buttonVariants, Menu } from "@coss-sv/ui";

const triggerClass = buttonVariants({ variant: "outline" });
</script>

{#snippet icon(path: string)}
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} />
  </svg>
{/snippet}

<div class="menu-fixture">
  <section data-particle="p-menu-1">
    <Menu.Root>
      <Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger>
      <Menu.Popup>
        <Menu.Group>
          <Menu.Label>Playback</Menu.Label>
          <Menu.Item
            >{@render icon("M6 3l14 9-14 9V3z")}Play<Menu.Shortcut>⌘P</Menu.Shortcut></Menu.Item
          >
          <Menu.Item disabled
            >{@render icon("M8 5v14M16 5v14")}Pause<Menu.Shortcut>⇧⌘P</Menu.Shortcut></Menu.Item
          >
          <Menu.Item
            >{@render icon("m19 20-9-8 9-8v16zM5 19V5")}Previous<Menu.Shortcut
              >⌘[</Menu.Shortcut
            ></Menu.Item
          >
          <Menu.Item
            >{@render icon("m5 4 9 8-9 8V4zM19 5v14")}Next<Menu.Shortcut
              >⌘]</Menu.Shortcut
            ></Menu.Item
          >
        </Menu.Group>
        <Menu.Separator />
        <Menu.CheckboxItem>Shuffle</Menu.CheckboxItem>
        <Menu.CheckboxItem>Repeat</Menu.CheckboxItem>
        <Menu.CheckboxItem disabled>Enhanced Audio</Menu.CheckboxItem>
        <Menu.Separator />
        <Menu.Group>
          <Menu.Label>Sort by</Menu.Label>
          <Menu.RadioGroup>
            <Menu.RadioItem value="artist">Artist</Menu.RadioItem>
            <Menu.RadioItem value="album">Album</Menu.RadioItem>
            <Menu.RadioItem value="title">Title</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Group>
        <Menu.Separator />
        <Menu.CheckboxItem variant="switch">Auto save</Menu.CheckboxItem>
        <Menu.Separator />
        <Menu.Sub>
          <Menu.SubTrigger>Add to Playlist</Menu.SubTrigger>
          <Menu.SubPopup>
            <Menu.Item>Jazz</Menu.Item>
            <Menu.Sub>
              <Menu.SubTrigger>Rock</Menu.SubTrigger>
              <Menu.SubPopup>
                <Menu.Item>Hard Rock</Menu.Item><Menu.Item>Soft Rock</Menu.Item
                ><Menu.Item>Classic Rock</Menu.Item>
                <Menu.Separator />
                <Menu.Item>Metal</Menu.Item><Menu.Item>Punk</Menu.Item><Menu.Item>Grunge</Menu.Item
                ><Menu.Item>Alternative</Menu.Item><Menu.Item>Indie</Menu.Item
                ><Menu.Item>Electronic</Menu.Item>
              </Menu.SubPopup>
            </Menu.Sub>
            <Menu.Item>Pop</Menu.Item>
          </Menu.SubPopup>
        </Menu.Sub>
        <Menu.Separator />
        <Menu.Item variant="destructive"
          >{@render icon("M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5")}Delete<Menu.Shortcut
            >⌘⌫</Menu.Shortcut
          ></Menu.Item
        >
      </Menu.Popup>
    </Menu.Root>
  </section>

  <section data-particle="p-menu-2">
    <Menu.Root
      ><Menu.Trigger class={triggerClass} openOnHover>Hover me</Menu.Trigger
      ><Menu.Popup
        ><Menu.Item>Item one</Menu.Item><Menu.Item>Item two</Menu.Item></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-3">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.CheckboxItem defaultChecked>Auto save</Menu.CheckboxItem
        ><Menu.CheckboxItem>Notifications</Menu.CheckboxItem></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-4">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.RadioGroup defaultValue="system"
          ><Menu.RadioItem value="light">Light</Menu.RadioItem
          ><Menu.RadioItem value="dark">Dark</Menu.RadioItem
          ><Menu.RadioItem value="system">System</Menu.RadioItem></Menu.RadioGroup
        ></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-5">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.LinkItem href="/docs">Docs</Menu.LinkItem
        ><Menu.LinkItem href="/particles">Particles</Menu.LinkItem></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-6">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.Group
          ><Menu.Label>Account</Menu.Label><Menu.Item>Profile</Menu.Item
          ><Menu.Item>Billing</Menu.Item></Menu.Group
        ><Menu.Separator />
        <Menu.Group
          ><Menu.Label>Support</Menu.Label><Menu.Item>Docs</Menu.Item
          ><Menu.Item>Contact</Menu.Item></Menu.Group
        ></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-7">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.Item>Item one</Menu.Item
        ><Menu.Sub
          ><Menu.SubTrigger>More</Menu.SubTrigger
          ><Menu.SubPopup
            ><Menu.Item>Sub item A</Menu.Item><Menu.Item>Sub item B</Menu.Item></Menu.SubPopup
          ></Menu.Sub
        ><Menu.Item>Item two</Menu.Item></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-8">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.Item closeOnClick>Profile</Menu.Item><Menu.Item closeOnClick>Settings</Menu.Item
        ><Menu.Item closeOnClick>Log out</Menu.Item></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-9">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger
      ><Menu.Popup
        ><Menu.CheckboxItem defaultChecked variant="switch">Auto save</Menu.CheckboxItem
        ><Menu.CheckboxItem variant="switch">Notifications</Menu.CheckboxItem
        ><Menu.CheckboxItem defaultChecked variant="switch"
          >Dark mode</Menu.CheckboxItem
        ></Menu.Popup
      ></Menu.Root
    >
  </section>
</div>

<style>
.menu-fixture {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  gap: 3rem;
  padding: 2rem;
}
.menu-fixture > section {
  display: flex;
  min-width: 0;
  justify-content: center;
}
</style>
