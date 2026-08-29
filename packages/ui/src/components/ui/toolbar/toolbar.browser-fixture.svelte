<script lang="ts">
  import { Select } from "@shardsui/svelte";
  import * as ToggleGroup from "../toggle-group/index.js";
  import * as Tooltip from "../tooltip/index.js";
  import * as Toolbar from "./index.js";

  const fonts = [
    { label: "Helvetica", value: "helvetica" },
    { label: "Arial", value: "arial" },
  ];
  let font = $state("helvetica");
  let alignment = $state<readonly string[]>([]);
  let tooltipOpen = $state(false);
  let toggleAnchor = $state<HTMLElement | null>(null);
</script>

<Toolbar.Root aria-label="Horizontal toolbar">
  <Toolbar.Button data-testid="one">One</Toolbar.Button>
  <Toolbar.Button data-testid="disabled" disabled>Disabled</Toolbar.Button>
  <Toolbar.Group>
    <Toolbar.Button data-testid="two">Two</Toolbar.Button>
    <Toolbar.Input data-testid="input" value="abcd" />
  </Toolbar.Group>
  <Toolbar.Button data-testid="three">Three</Toolbar.Button>
</Toolbar.Root>

<Toolbar.Root aria-label="Vertical toolbar" orientation="vertical">
  <Toolbar.Button data-testid="v-one">Vertical one</Toolbar.Button>
  <Toolbar.Button data-testid="v-two">Vertical two</Toolbar.Button>
</Toolbar.Root>

<Toolbar.Root aria-label="RTL toolbar" dir="rtl">
  <Toolbar.Button data-testid="rtl-one">RTL one</Toolbar.Button>
  <Toolbar.Button data-testid="rtl-two">RTL two</Toolbar.Button>
</Toolbar.Root>

<Tooltip.Provider delay={0}>
  <Toolbar.Root aria-label="Composed toolbar" loopFocus={false}>
    <ToggleGroup.Root bind:value={alignment}>
      <Tooltip.Root bind:open={tooltipOpen}>
        <Tooltip.Trigger
          as="span"
          class="contents"
          onfocusin={() => (tooltipOpen = true)}
          onfocusout={() => (tooltipOpen = false)}
        >
          <ToggleGroup.Item
            aria-describedby="toggle-tooltip"
            aria-label="Toggle bold"
            bind:ref={toggleAnchor}
            data-testid="toggle"
            value="bold">Bold</ToggleGroup.Item
          >
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={toggleAnchor ?? undefined} id="toggle-tooltip"
          >Toggle bold</Tooltip.Popup
        >
      </Tooltip.Root>
    </ToggleGroup.Root>
    <Select.Root bind:value={font} items={fonts}>
      <Select.Trigger aria-label="Font" data-testid="select-trigger"
        ><Select.Value /></Select.Trigger
      >
      <Select.Portal>
        <Select.Positioner
          ><Select.Popup
            ><Select.List>
              {#each fonts as item (item.value)}
                <Select.Item data-testid={`font-${item.value}`} value={item.value}
                  >{item.label}</Select.Item
                >
              {/each}
            </Select.List></Select.Popup
          ></Select.Positioner
        >
      </Select.Portal>
    </Select.Root>
    <Toolbar.Button data-testid="composition-save">Save</Toolbar.Button>
  </Toolbar.Root>
</Tooltip.Provider>
<output data-testid="alignment">{alignment.join(",")}</output>
<output data-testid="font">{font}</output>
