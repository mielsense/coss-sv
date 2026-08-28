<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["toggle-group", "tooltip"],
  id: "p-toggle-group-9",
  interactive: true,
  responsive: false,
  title: "Toggle group with tooltips",
});
</script>

<script lang="ts">
import { ToggleGroup, Tooltip } from "@coss-sv/ui";
import { TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

const tools = [
  { icon: TextBoldIcon, label: "Toggle bold", value: "bold" },
  { icon: TextItalicIcon, label: "Toggle italic", value: "italic" },
  { icon: TextUnderlineIcon, label: "Toggle underline", value: "underline" },
] as const;
type ToolValue = (typeof tools)[number]["value"];

const uid = $props.id();
let anchors = $state<Record<ToolValue, HTMLElement | null>>({
  bold: null,
  italic: null,
  underline: null,
});
let tooltipOpen = $state<Record<ToolValue, boolean>>({
  bold: false,
  italic: false,
  underline: false,
});
const hoverTimers: Record<ToolValue, number | undefined> = {
  bold: undefined,
  italic: undefined,
  underline: undefined,
};

function clearHoverTimer(value: ToolValue) {
  const timer = hoverTimers[value];
  if (timer !== undefined) window.clearTimeout(timer);
  hoverTimers[value] = undefined;
}

function openTooltip(value: ToolValue) {
  clearHoverTimer(value);
  tooltipOpen[value] = true;
}

function openTooltipAfterDelay(value: ToolValue) {
  clearHoverTimer(value);
  hoverTimers[value] = window.setTimeout(() => {
    tooltipOpen[value] = true;
    hoverTimers[value] = undefined;
  }, 600);
}

function closeTooltip(value: ToolValue) {
  clearHoverTimer(value);
  tooltipOpen[value] = false;
}

$effect(() => () => {
  for (const tool of tools) clearHoverTimer(tool.value);
});
</script>

<Tooltip.Provider>
  <ToggleGroup.Root defaultValue={["bold"]} multiple>
    {#each tools as tool (tool.value)}
      <Tooltip.Root bind:open={tooltipOpen[tool.value]} triggerId={`${uid}-${tool.value}-trigger`}>
        <ToggleGroup.Item
          aria-describedby={`${uid}-${tool.value}-tooltip`}
          aria-label={tool.label}
          bind:ref={anchors[tool.value]}
          data-slot="tooltip-trigger"
          id={`${uid}-${tool.value}-trigger`}
          onblur={() => closeTooltip(tool.value)}
          onclick={() => closeTooltip(tool.value)}
          onfocus={() => openTooltip(tool.value)}
          onmouseenter={() => openTooltipAfterDelay(tool.value)}
          onmouseleave={() => closeTooltip(tool.value)}
          value={tool.value}
        >
          <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
        </ToggleGroup.Item>
        <Tooltip.Popup anchor={anchors[tool.value]} id={`${uid}-${tool.value}-tooltip`}>
          {tool.value[0]?.toUpperCase()}{tool.value.slice(1)}
        </Tooltip.Popup>
      </Tooltip.Root>
    {/each}
  </ToggleGroup.Root>
</Tooltip.Provider>
