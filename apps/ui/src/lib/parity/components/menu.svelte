<script lang="ts">
import { buttonVariants, Menu } from "@coss-sv/ui";

const triggerClass = buttonVariants({ variant: "outline" });
</script>

{#snippet playIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-play"
    aria-hidden="true"
  >
    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
  </svg>
{/snippet}
{#snippet pauseIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-pause"
    aria-hidden="true"
  >
    <rect x="14" y="3" width="5" height="18" rx="1" />
    <rect x="5" y="3" width="5" height="18" rx="1" />
  </svg>
{/snippet}
{#snippet skipBackIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-skip-back"
    aria-hidden="true"
  >
    <path
      d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"
    />
    <path d="M3 20V4" />
  </svg>
{/snippet}
{#snippet skipForwardIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-skip-forward"
    aria-hidden="true"
  >
    <path d="M21 4v16" />
    <path
      d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"
    />
  </svg>
{/snippet}
{#snippet trashIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-trash"
    aria-hidden="true"
  >
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
{/snippet}

<div class="menu-fixture">
  <section data-particle="p-menu-1">
    <Menu.Root>
      <Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger>
      <Menu.Popup>
        <Menu.Group>
          <Menu.Label>Playback</Menu.Label>
          <Menu.Item>{@render playIcon()}Play<Menu.Shortcut>⌘P</Menu.Shortcut></Menu.Item>
          <Menu.Item disabled
            >{@render pauseIcon()}Pause<Menu.Shortcut>⇧⌘P</Menu.Shortcut></Menu.Item
          >
          <Menu.Item>{@render skipBackIcon()}Previous<Menu.Shortcut>⌘[</Menu.Shortcut></Menu.Item>
          <Menu.Item>{@render skipForwardIcon()}Next<Menu.Shortcut>⌘]</Menu.Shortcut></Menu.Item>
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
          >{@render trashIcon()}Delete<Menu.Shortcut>⌘⌫</Menu.Shortcut></Menu.Item
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
