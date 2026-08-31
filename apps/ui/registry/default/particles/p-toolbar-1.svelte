<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
    HugeiconsIcon,
    Select,
    ToggleGroup,
    Toolbar,
    Tooltip,
  } from "@coss-sv/ui";
  import DollarSignIcon from "@hugeicons/core-free-icons/DollarSignIcon";
  import PercentIcon from "@hugeicons/core-free-icons/PercentIcon";
  import TextAlignCenterIcon from "@hugeicons/core-free-icons/TextAlignCenterIcon";
  import TextAlignLeftIcon from "@hugeicons/core-free-icons/TextAlignLeftIcon";
  import TextAlignRightIcon from "@hugeicons/core-free-icons/TextAlignRightIcon";

  const fonts = [
    { label: "Helvetica", value: "helvetica" },
    { label: "Arial", value: "arial" },
    { label: "Times New Roman", value: "times-new-roman" },
  ];
  const uid = $props.id();
  const leftTooltip = Tooltip.TooltipCreateHandle();
  const centerTooltip = Tooltip.TooltipCreateHandle();
  const rightTooltip = Tooltip.TooltipCreateHandle();
  const currencyTooltip = Tooltip.TooltipCreateHandle();
  const percentTooltip = Tooltip.TooltipCreateHandle();
  const fontTooltip = Tooltip.TooltipCreateHandle();
  const tooltipIds = {
    center: `${uid}-center-tooltip`,
    currency: `${uid}-currency-tooltip`,
    font: `${uid}-font-tooltip`,
    left: `${uid}-left-tooltip`,
    percent: `${uid}-percent-tooltip`,
    right: `${uid}-right-tooltip`,
  };
  let font = $state("helvetica");
  const fontLabel = $derived(fonts.find((item) => item.value === font)?.label ?? "Helvetica");
</script>

<Tooltip.Provider>
  <Toolbar.Root aria-label="Text formatting" class="w-fit">
    <ToggleGroup.Root class="border-none p-0" defaultValue={["left"]}>
      <Tooltip.Root handle={leftTooltip}>
        <ToggleGroup.Item
          {@attach Tooltip.createTriggerAttachment(leftTooltip, () => ({
            ariaDescribedBy: tooltipIds.left,
            id: `${uid}-left`,
          }))}
          aria-describedby={tooltipIds.left}
          aria-label="Align left"
          id={`${uid}-left`}
          value="left"
        >
          <HugeiconsIcon aria-hidden="true" icon={TextAlignLeftIcon} strokeWidth={2} />
        </ToggleGroup.Item>
        <Tooltip.Popup id={tooltipIds.left} sideOffset={8}>Align left</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root handle={centerTooltip}>
        <ToggleGroup.Item
          {@attach Tooltip.createTriggerAttachment(centerTooltip, () => ({
            ariaDescribedBy: tooltipIds.center,
            id: `${uid}-center`,
          }))}
          aria-describedby={tooltipIds.center}
          aria-label="Toggle center"
          id={`${uid}-center`}
          value="center"
        >
          <HugeiconsIcon aria-hidden="true" icon={TextAlignCenterIcon} strokeWidth={2} />
        </ToggleGroup.Item>
        <Tooltip.Popup id={tooltipIds.center} sideOffset={8}>Align center</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root handle={rightTooltip}>
        <ToggleGroup.Item
          {@attach Tooltip.createTriggerAttachment(rightTooltip, () => ({
            ariaDescribedBy: tooltipIds.right,
            id: `${uid}-right`,
          }))}
          aria-describedby={tooltipIds.right}
          aria-label="Toggle right"
          id={`${uid}-right`}
          value="right"
        >
          <HugeiconsIcon aria-hidden="true" icon={TextAlignRightIcon} strokeWidth={2} />
        </ToggleGroup.Item>
        <Tooltip.Popup id={tooltipIds.right} sideOffset={8}>Align right</Tooltip.Popup>
      </Tooltip.Root>
    </ToggleGroup.Root>
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Number formatting">
      <Tooltip.Root handle={currencyTooltip}>
        <Toolbar.Button
          {@attach Tooltip.createTriggerAttachment(currencyTooltip, () => ({
            ariaDescribedBy: tooltipIds.currency,
            id: `${uid}-currency`,
          }))}
          aria-describedby={tooltipIds.currency}
          aria-label="Format as currency"
          class={buttonVariants({ size: "icon", variant: "ghost" })}
          id={`${uid}-currency`}
        >
          <HugeiconsIcon aria-hidden="true" icon={DollarSignIcon} strokeWidth={2} />
        </Toolbar.Button>
        <Tooltip.Popup id={tooltipIds.currency} sideOffset={8}>Format as currency</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root handle={percentTooltip}>
        <Toolbar.Button
          {@attach Tooltip.createTriggerAttachment(percentTooltip, () => ({
            ariaDescribedBy: tooltipIds.percent,
            id: `${uid}-percent`,
          }))}
          aria-describedby={tooltipIds.percent}
          aria-label="Format as percent"
          class={buttonVariants({ size: "icon", variant: "ghost" })}
          id={`${uid}-percent`}
        >
          <HugeiconsIcon aria-hidden="true" icon={PercentIcon} strokeWidth={2} />
        </Toolbar.Button>
        <Tooltip.Popup id={tooltipIds.percent} sideOffset={8}>Format as percent</Tooltip.Popup>
      </Tooltip.Root>
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Font">
      <Select.Root items={fonts} bind:value={font}>
        <Tooltip.Root handle={fontTooltip}>
          <Select.Trigger
            {@attach Tooltip.createTriggerAttachment(fontTooltip, () => ({
              ariaDescribedBy: tooltipIds.font,
              id: `${uid}-font`,
            }))}
            aria-describedby={tooltipIds.font}
            aria-label={fontLabel}
            id={`${uid}-font`}
            title="Select a different font"
          >
            <Select.Value />
          </Select.Trigger>
          <Tooltip.Popup id={tooltipIds.font} sideOffset={8}>Select a different font</Tooltip.Popup>
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
