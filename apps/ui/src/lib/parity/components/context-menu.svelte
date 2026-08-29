<script lang="ts">
  import { ContextMenu } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  const surfaceClass =
    "flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm";
</script>

{#snippet surface()}
  <ContextMenu.Trigger class={surfaceClass}>Right click here</ContextMenu.Trigger>
{/snippet}
{#snippet pencilIcon()}
  <FixtureIcon aria-hidden="true" name="pencil" />
{/snippet}
{#snippet copyIcon()}
  <FixtureIcon aria-hidden="true" name="copy" />
{/snippet}
{#snippet shareIcon()}
  <FixtureIcon aria-hidden="true" name="share" />
{/snippet}
{#snippet trashIcon()}
  <FixtureIcon aria-hidden="true" name="trash" />
{/snippet}

<div class="context-menu-fixture">
  <section data-particle="p-context-menu-1">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.Item>Back</ContextMenu.Item><ContextMenu.Item>Forward</ContextMenu.Item>
        <ContextMenu.Separator /><ContextMenu.Item>Reload</ContextMenu.Item></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-2">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.LinkItem href="/docs">Docs</ContextMenu.LinkItem><ContextMenu.LinkItem
          href="/particles">Particles</ContextMenu.LinkItem
        ></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-3">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.Item>Cut</ContextMenu.Item><ContextMenu.Item>Copy</ContextMenu.Item
        ><ContextMenu.Item>Paste</ContextMenu.Item><ContextMenu.Sub
          ><ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger><ContextMenu.SubPopup
            ><ContextMenu.Item>Email link</ContextMenu.Item><ContextMenu.Item
              >Messages</ContextMenu.Item
            ><ContextMenu.Item>Notes</ContextMenu.Item></ContextMenu.SubPopup
          ></ContextMenu.Sub
        ></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-4">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.CheckboxItem defaultChecked>Show hidden files</ContextMenu.CheckboxItem
        ><ContextMenu.CheckboxItem>Compact view</ContextMenu.CheckboxItem></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-5">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.Group
          ><ContextMenu.Label>File</ContextMenu.Label><ContextMenu.Item>Rename</ContextMenu.Item
          ><ContextMenu.Item>Duplicate</ContextMenu.Item></ContextMenu.Group
        ><ContextMenu.Separator />
        <ContextMenu.Group
          ><ContextMenu.Label>Share</ContextMenu.Label><ContextMenu.Item>Send copy</ContextMenu.Item
          ><ContextMenu.Item>Export</ContextMenu.Item></ContextMenu.Group
        ></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-6">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.Item
          >{@render pencilIcon()}Edit<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut
          ></ContextMenu.Item
        ><ContextMenu.Item
          >{@render copyIcon()}Copy<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut></ContextMenu.Item
        ><ContextMenu.Item>{@render shareIcon()}Share</ContextMenu.Item><ContextMenu.Separator />
        <ContextMenu.Item variant="destructive"
          >{@render trashIcon()}Delete<ContextMenu.Shortcut>⌘⌫</ContextMenu.Shortcut
          ></ContextMenu.Item
        ></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-7">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.RadioGroup defaultValue="system"
          ><ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem><ContextMenu.RadioItem
            value="dark">Dark</ContextMenu.RadioItem
          ><ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem
          ></ContextMenu.RadioGroup
        ></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-8">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.CheckboxItem defaultChecked variant="switch"
          >Auto save</ContextMenu.CheckboxItem
        ><ContextMenu.CheckboxItem variant="switch">Show preview</ContextMenu.CheckboxItem
        ></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>
</div>

<style>
  .context-menu-fixture {
    display: grid;
    box-sizing: border-box;
    width: 100%;
    gap: 3rem;
    padding: 2rem;
  }
  .context-menu-fixture > section {
    display: flex;
    min-width: 0;
    justify-content: center;
  }
</style>
