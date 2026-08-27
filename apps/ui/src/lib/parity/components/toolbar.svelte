<script lang="ts">
import { buttonVariants, ToggleGroup, Toolbar } from "@coss-sv/ui";

const iconButton = buttonVariants({ size: "icon", variant: "ghost" });
const saveButton = buttonVariants();
const fonts = [
  { label: "Helvetica", value: "helvetica" },
  { label: "Arial", value: "arial" },
  { label: "Times New Roman", value: "times-new-roman" },
];
let font = $state("helvetica");
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

<div class="toolbar-fixture">
  <section data-particle="p-toolbar-1">
    <Toolbar.Root aria-label="Text formatting">
      <ToggleGroup.Root class="border-none p-0" defaultValue={["left"]}>
        <ToggleGroup.Item
          aria-label="Align left"
          class={iconButton}
          data-slot="toolbar-button"
          title="Align left"
          value="left"
          >{@render icon("M15 6H3M21 12H3M15 18H3")}</ToggleGroup.Item
        >
        <ToggleGroup.Item
          aria-label="Align center"
          class={iconButton}
          data-slot="toolbar-button"
          title="Align center"
          value="center"
          >{@render icon("M17 6H7M21 12H3M17 18H7")}</ToggleGroup.Item
        >
        <ToggleGroup.Item
          aria-label="Align right"
          class={iconButton}
          data-slot="toolbar-button"
          title="Align right"
          value="right"
          >{@render icon("M21 6H9M21 12H3M21 18H9")}</ToggleGroup.Item
        >
      </ToggleGroup.Root>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.Button
          aria-label="Format as currency"
          class={iconButton}
          title="Format as currency"
          >{@render icon("M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6")}</Toolbar.Button
        >
        <Toolbar.Button aria-label="Format as percent" class={iconButton} title="Format as percent"
          >{@render icon("m19 5-14 14M6.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3")}</Toolbar.Button
        >
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <select
          bind:value={font}
          class={buttonVariants({ variant: "outline" })}
          title="Select a different font"
        >
          {#each fonts as item (item.value)}
            <option value={item.value}>{item.label}</option>
          {/each}
        </select>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group><Toolbar.Button class={saveButton}>Save</Toolbar.Button></Toolbar.Group>
    </Toolbar.Root>
  </section>
</div>

<style>
.toolbar-fixture {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  gap: 3rem;
  padding: 2rem;
}
.toolbar-fixture > section {
  display: flex;
  min-width: 0;
  justify-content: center;
}
</style>
