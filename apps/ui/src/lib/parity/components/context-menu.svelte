<script lang="ts">
import { ContextMenu } from "@coss-sv/ui";

const surfaceClass =
  "flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm";
</script>

{#snippet surface()}
  <ContextMenu.Trigger class={surfaceClass}>Right click here</ContextMenu.Trigger>
{/snippet}
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
{#snippet pencilIcon()}
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
    <path
      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .622.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    />
    <path d="m15 5 4 4" />
  </svg>
{/snippet}
{#snippet trashIcon()}
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
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
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
          >{@render icon("M8 8h11v11H8zM5 16H4V5h11v1")}Copy<ContextMenu.Shortcut
            >⌘C</ContextMenu.Shortcut
          ></ContextMenu.Item
        ><ContextMenu.Item
          >{@render icon("m12 3 4 4-4 4M16 7H8a5 5 0 0 0-5 5v5M5 21h14a2 2 0 0 0 2-2v-5")}Share</ContextMenu.Item
        ><ContextMenu.Separator />
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
