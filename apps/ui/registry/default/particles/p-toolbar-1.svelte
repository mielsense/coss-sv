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
  import { buttonVariants, Select, ToggleGroup, Toolbar, Tooltip } from "@coss-sv/ui";
  import {
    AlignHorizontalCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    DollarSignIcon,
    PercentIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  const fonts = [
    { label: "Helvetica", value: "helvetica" },
    { label: "Arial", value: "arial" },
    { label: "Times New Roman", value: "times-new-roman" },
  ];
  let leftAnchor = $state<HTMLElement | null>(null);
  let centerAnchor = $state<HTMLElement | null>(null);
  let rightAnchor = $state<HTMLElement | null>(null);
  let currencyAnchor = $state<HTMLElement | null>(null);
  let percentAnchor = $state<HTMLElement | null>(null);
  let fontAnchor = $state<HTMLButtonElement | null>(null);
</script>

<Tooltip.Provider>
  <Toolbar.Root aria-label="Text formatting" class="w-fit">
    <ToggleGroup.Root class="border-none p-0" defaultValue={["left"]}>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="contents">
          <ToggleGroup.Item aria-label="Align left" bind:ref={leftAnchor} value="left">
            <HugeiconsIcon aria-hidden="true" icon={AlignLeftIcon} strokeWidth={2} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={leftAnchor ?? undefined} sideOffset={8}>Align left</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="contents">
          <ToggleGroup.Item aria-label="Toggle center" bind:ref={centerAnchor} value="center">
            <HugeiconsIcon aria-hidden="true" icon={AlignHorizontalCenterIcon} strokeWidth={2} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={centerAnchor ?? undefined} sideOffset={8}>Align center</Tooltip.Popup
        >
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="contents">
          <ToggleGroup.Item aria-label="Toggle right" bind:ref={rightAnchor} value="right">
            <HugeiconsIcon aria-hidden="true" icon={AlignRightIcon} strokeWidth={2} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={rightAnchor ?? undefined} sideOffset={8}>Align right</Tooltip.Popup>
      </Tooltip.Root>
    </ToggleGroup.Root>
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Number formatting">
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="contents">
          <Toolbar.Button
            aria-label="Format as currency"
            bind:ref={currencyAnchor}
            class={buttonVariants({ size: "icon", variant: "ghost" })}
          >
            <HugeiconsIcon aria-hidden="true" icon={DollarSignIcon} strokeWidth={2} />
          </Toolbar.Button>
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={currencyAnchor ?? undefined} sideOffset={8}
          >Format as currency</Tooltip.Popup
        >
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="contents">
          <Toolbar.Button
            aria-label="Format as percent"
            bind:ref={percentAnchor}
            class={buttonVariants({ size: "icon", variant: "ghost" })}
          >
            <HugeiconsIcon aria-hidden="true" icon={PercentIcon} strokeWidth={2} />
          </Toolbar.Button>
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={percentAnchor ?? undefined} sideOffset={8}
          >Format as percent</Tooltip.Popup
        >
      </Tooltip.Root>
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Font">
      <Select.Root aria-label="Font" items={fonts} value="helvetica">
        <Tooltip.Root>
          <Tooltip.Trigger as="span" class="contents">
            <Select.Trigger bind:ref={fontAnchor} title="Select a different font">
              <Select.Value />
            </Select.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Popup anchor={fontAnchor ?? undefined} sideOffset={8}
            >Select a different font</Tooltip.Popup
          >
        </Tooltip.Root>
        <Select.Popup>
          {#each fonts as item (item.value)}
            <Select.Item value={item.value}>{item.label}</Select.Item>
          {/each}
        </Select.Popup>
      </Select.Root>
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Save">
      <Toolbar.Button class={buttonVariants()}>Save</Toolbar.Button>
    </Toolbar.Group>
  </Toolbar.Root>
</Tooltip.Provider>
