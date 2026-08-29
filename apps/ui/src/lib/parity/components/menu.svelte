<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  const triggerClass = buttonVariants({ variant: "outline" });
</script>

{#snippet playIcon()}
  <FixtureIcon aria-hidden="true" name="play" />
{/snippet}
{#snippet pauseIcon()}
  <FixtureIcon aria-hidden="true" name="pause" />
{/snippet}
{#snippet skipBackIcon()}
  <FixtureIcon aria-hidden="true" name="previous" />
{/snippet}
{#snippet skipForwardIcon()}
  <FixtureIcon aria-hidden="true" name="next" />
{/snippet}
{#snippet trashIcon()}
  <FixtureIcon aria-hidden="true" name="trash" />
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
                <Menu.Item>Hard Rock</Menu.Item><Menu.Item>Soft Rock</Menu.Item><Menu.Item
                  >Classic Rock</Menu.Item
                >
                <Menu.Separator />
                <Menu.Item>Metal</Menu.Item><Menu.Item>Punk</Menu.Item><Menu.Item>Grunge</Menu.Item
                ><Menu.Item>Alternative</Menu.Item><Menu.Item>Indie</Menu.Item><Menu.Item
                  >Electronic</Menu.Item
                >
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
      ><Menu.Trigger class={triggerClass} openOnHover>Hover me</Menu.Trigger><Menu.Popup
        ><Menu.Item>Item one</Menu.Item><Menu.Item>Item two</Menu.Item></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-3">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.CheckboxItem defaultChecked>Auto save</Menu.CheckboxItem><Menu.CheckboxItem
          >Notifications</Menu.CheckboxItem
        ></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-4">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.RadioGroup defaultValue="system"
          ><Menu.RadioItem value="light">Light</Menu.RadioItem><Menu.RadioItem value="dark"
            >Dark</Menu.RadioItem
          ><Menu.RadioItem value="system">System</Menu.RadioItem></Menu.RadioGroup
        ></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-5">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.LinkItem href="/docs">Docs</Menu.LinkItem><Menu.LinkItem href="/particles"
          >Particles</Menu.LinkItem
        ></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-6">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.Group
          ><Menu.Label>Account</Menu.Label><Menu.Item>Profile</Menu.Item><Menu.Item
            >Billing</Menu.Item
          ></Menu.Group
        ><Menu.Separator />
        <Menu.Group
          ><Menu.Label>Support</Menu.Label><Menu.Item>Docs</Menu.Item><Menu.Item>Contact</Menu.Item
          ></Menu.Group
        ></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-7">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.Item>Item one</Menu.Item><Menu.Sub
          ><Menu.SubTrigger>More</Menu.SubTrigger><Menu.SubPopup
            ><Menu.Item>Sub item A</Menu.Item><Menu.Item>Sub item B</Menu.Item></Menu.SubPopup
          ></Menu.Sub
        ><Menu.Item>Item two</Menu.Item></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-8">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.Item closeOnClick>Profile</Menu.Item><Menu.Item closeOnClick>Settings</Menu.Item
        ><Menu.Item closeOnClick>Log out</Menu.Item></Menu.Popup
      ></Menu.Root
    >
  </section>

  <section data-particle="p-menu-9">
    <Menu.Root
      ><Menu.Trigger class={triggerClass}>Open menu</Menu.Trigger><Menu.Popup
        ><Menu.CheckboxItem defaultChecked variant="switch">Auto save</Menu.CheckboxItem
        ><Menu.CheckboxItem variant="switch">Notifications</Menu.CheckboxItem><Menu.CheckboxItem
          defaultChecked
          variant="switch">Dark mode</Menu.CheckboxItem
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
