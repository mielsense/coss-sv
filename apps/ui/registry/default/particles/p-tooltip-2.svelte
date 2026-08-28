<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["toggle-group", "tooltip"],
  id: "p-tooltip-2",
  interactive: true,
  responsive: true,
  title: "Tooltip provider group",
});
</script>
<script lang="ts">
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { ToggleGroup, Tooltip } from "@coss-sv/ui";
const controls = [
  { label: "Bold", value: "bold", icon: BoldIcon },
  { label: "Italic", value: "italic", icon: ItalicIcon },
  { label: "Underline", value: "underline", icon: UnderlineIcon },
] as const;
</script>
<Tooltip.Provider
  ><ToggleGroup.Root defaultValue={["bold"]} multiple
    >{#each controls as control}
      <Tooltip.Root
        ><Tooltip.Trigger as="span" class="contents"
          ><ToggleGroup.Item
            aria-describedby={`format-${control.value}-tooltip`}
            aria-label={`Toggle ${control.value}`}
            value={control.value}
            ><HugeiconsIcon
              aria-hidden="true"
              icon={control.icon}
              strokeWidth={2}
            /></ToggleGroup.Item
          ></Tooltip.Trigger
        ><Tooltip.Popup id={`format-${control.value}-tooltip`}
          >{control.label}</Tooltip.Popup
        ></Tooltip.Root
      >
    {/each}</ToggleGroup.Root
  ></Tooltip.Provider
>
