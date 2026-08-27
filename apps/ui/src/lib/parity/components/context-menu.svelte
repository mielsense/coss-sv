<script lang="ts">
import { ContextMenu } from "@coss-sv/ui";

const surfaceClass =
  "flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm";
</script>

{#snippet surface()}
  <ContextMenu.Trigger class={surfaceClass}>Right click here</ContextMenu.Trigger>
{/snippet}
{#snippet pencilIcon()}
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
    class="lucide lucide-pencil"
    aria-hidden="true"
  >
    <path
      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    />
    <path d="m15 5 4 4" />
  </svg>
{/snippet}
{#snippet copyIcon()}
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
    class="lucide lucide-copy"
    aria-hidden="true"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
{/snippet}
{#snippet shareIcon()}
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
    class="lucide lucide-share"
    aria-hidden="true"
  >
    <path d="M12 2v13" />
    <path d="m16 6-4-4-4 4" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
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
        ><ContextMenu.LinkItem href="/docs">Docs</ContextMenu.LinkItem
        ><ContextMenu.LinkItem href="/particles">Particles</ContextMenu.LinkItem></ContextMenu.Popup
      ></ContextMenu.Root
    >
  </section>

  <section data-particle="p-context-menu-3">
    <ContextMenu.Root
      >{@render surface()}
      <ContextMenu.Popup
        ><ContextMenu.Item>Cut</ContextMenu.Item><ContextMenu.Item>Copy</ContextMenu.Item
        ><ContextMenu.Item>Paste</ContextMenu.Item
        ><ContextMenu.Sub
          ><ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger
          ><ContextMenu.SubPopup
            ><ContextMenu.Item>Email link</ContextMenu.Item
            ><ContextMenu.Item>Messages</ContextMenu.Item
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
          >{@render pencilIcon()}Edit<ContextMenu.Shortcut
            >⌘E</ContextMenu.Shortcut
          ></ContextMenu.Item
        ><ContextMenu.Item
          >{@render copyIcon()}Copy<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut></ContextMenu.Item
        ><ContextMenu.Item>{@render shareIcon()}Share</ContextMenu.Item><ContextMenu.Separator />
        <ContextMenu.Item variant="destructive"
          >{@render trashIcon()}Delete<ContextMenu.Shortcut
            >⌘⌫</ContextMenu.Shortcut
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
          ><ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem
          ><ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem
          ><ContextMenu.RadioItem value="system"
            >System</ContextMenu.RadioItem
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
        ><ContextMenu.CheckboxItem variant="switch"
          >Show preview</ContextMenu.CheckboxItem
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
