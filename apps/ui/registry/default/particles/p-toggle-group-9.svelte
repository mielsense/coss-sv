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
];
</script>

<Tooltip.Provider>
  <ToggleGroup.Root defaultValue={["bold"]} multiple>
    {#each tools as tool (tool.value)}
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="contents" tabindex={-1}>
          <ToggleGroup.Item aria-label={tool.label} value={tool.value}>
            <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Popup>{tool.value[0]?.toUpperCase()}{tool.value.slice(1)}</Tooltip.Popup>
      </Tooltip.Root>
    {/each}
  </ToggleGroup.Root>
</Tooltip.Provider>
