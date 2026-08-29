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
  import { ToggleGroup, Tooltip, HugeiconsIcon } from "@coss-sv/ui";
  import { TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";
  import { tick } from "svelte";

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
  const tooltipHandles: Record<ToolValue, Tooltip.Handle> = {
    bold: new Tooltip.Handle(),
    italic: new Tooltip.Handle(),
    underline: new Tooltip.Handle(),
  };

  async function openTooltipOnFocus(value: ToolValue, target: HTMLElement) {
    await tick();
    if (document.activeElement === target) {
      tooltipHandles[value].open(`${uid}-${value}-trigger`);
    }
  }
</script>

<Tooltip.Provider>
  <ToggleGroup.Root defaultValue={["bold"]} multiple>
    {#each tools as tool (tool.value)}
      <Tooltip.Root handle={tooltipHandles[tool.value]}>
        <Tooltip.Trigger
          as="span"
          class="contents"
          handle={tooltipHandles[tool.value]}
          id={`${uid}-${tool.value}-trigger`}
        >
          <ToggleGroup.Item
            aria-describedby={`${uid}-${tool.value}-tooltip`}
            aria-label={tool.label}
            bind:ref={anchors[tool.value]}
            onblur={() => tooltipHandles[tool.value].close()}
            onfocus={(event) => void openTooltipOnFocus(tool.value, event.currentTarget)}
            value={tool.value}
          >
            <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Popup anchor={anchors[tool.value]} id={`${uid}-${tool.value}-tooltip`}>
          {tool.value[0]?.toUpperCase()}{tool.value.slice(1)}
        </Tooltip.Popup>
      </Tooltip.Root>
    {/each}
  </ToggleGroup.Root>
</Tooltip.Provider>
