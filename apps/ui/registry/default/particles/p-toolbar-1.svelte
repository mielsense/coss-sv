<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "select", "toggle-group", "toolbar", "tooltip"],
    id: "p-toolbar-1",
    interactive: true,
    responsive: true,
    title: "Toolbar with toggles, buttons, and select",
  });
</script>

<script lang="ts">
  import {
    buttonVariants,
    Select,
    ToggleGroup,
    Toolbar,
    Tooltip,
    toggleVariants,
  } from "@coss-sv/ui";
  import {
    AlignHorizontalCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    DollarSignIcon,
    PercentIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  const alignments = [
    { label: "Align left", value: "left", icon: AlignLeftIcon },
    { label: "Align center", value: "center", icon: AlignHorizontalCenterIcon },
    { label: "Align right", value: "right", icon: AlignRightIcon },
  ] as const;
  const formats = [
    { label: "Format as currency", icon: DollarSignIcon },
    { label: "Format as percent", icon: PercentIcon },
  ] as const;
  const fonts = [
    { label: "Helvetica", value: "helvetica" },
    { label: "Arial", value: "arial" },
    { label: "Times New Roman", value: "times-new-roman" },
  ];
  let alignment = $state(["left"]);
  function move(event: KeyboardEvent): void {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const current = event.currentTarget;
    if (!(current instanceof HTMLElement)) return;
    const items = Array.from(
      current
        .closest('[role="toolbar"]')
        ?.querySelectorAll<HTMLElement>('button,[role="combobox"]') ?? [],
    );
    const index = items.indexOf(current);
    if (index < 0) return;
    event.preventDefault();
    event.stopPropagation();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  }
</script>

<Tooltip.Provider
  ><Toolbar.Root aria-label="Text formatting" class="w-fit">
    <ToggleGroup.Root class="border-none p-0" multiple bind:value={alignment}>
      {#each alignments as item (item.value)}<Tooltip.Root
          ><Tooltip.Trigger
            aria-label={item.label}
            aria-pressed={alignment.includes(item.value)}
            class={toggleVariants()}
            data-pressed={alignment.includes(item.value) ? "" : undefined}
            onclick={() =>
              (alignment = alignment.includes(item.value)
                ? alignment.filter((value) => value !== item.value)
                : [item.value])}
            onkeydown={move}
            ><HugeiconsIcon aria-hidden="true" icon={item.icon} strokeWidth={2} /></Tooltip.Trigger
          ><Tooltip.Popup sideOffset={8}>{item.label}</Tooltip.Popup></Tooltip.Root
        >{/each}
    </ToggleGroup.Root>
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Number formatting"
      >{#each formats as item (item.label)}<Tooltip.Root
          ><Tooltip.Trigger
            aria-label={item.label}
            class={buttonVariants({ size: "icon", variant: "ghost" })}
            onkeydown={move}
            ><HugeiconsIcon aria-hidden="true" icon={item.icon} strokeWidth={2} /></Tooltip.Trigger
          ><Tooltip.Popup sideOffset={8}>{item.label}</Tooltip.Popup></Tooltip.Root
        >{/each}</Toolbar.Group
    >
    <Toolbar.Separator /><Toolbar.Group aria-label="Font"
      ><Select.Root aria-label="Font" items={fonts} value="helvetica"
        ><Select.Trigger onkeydown={move} title="Select a different font"
          ><Select.Value /></Select.Trigger
        ><Select.Popup
          >{#each fonts as item (item.value)}<Select.Item value={item.value}
              >{item.label}</Select.Item
            >{/each}</Select.Popup
        ></Select.Root
      ></Toolbar.Group
    >
    <Toolbar.Separator /><Toolbar.Group aria-label="Save"
      ><Toolbar.Button class={buttonVariants()} onkeydown={move}>Save</Toolbar.Button
      ></Toolbar.Group
    >
  </Toolbar.Root></Tooltip.Provider
>
