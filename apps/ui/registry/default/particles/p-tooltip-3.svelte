<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["toggle-group", "tooltip"],
  id: "p-tooltip-3",
  interactive: true,
  responsive: true,
  title: "Detached animated tooltip",
});
</script>
<script lang="ts">
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { ToggleGroup, Tooltip } from "@coss-sv/ui";
import type { Snippet } from "svelte";
const tooltipHandle = new Tooltip.Handle<Snippet>();
const controls = [
  { label: "Toggle bold", value: "bold", icon: BoldIcon },
  { label: "Toggle italic", value: "italic", icon: ItalicIcon },
  { label: "Toggle underline", value: "underline", icon: UnderlineIcon },
] as const;
</script>
{#snippet boldContent()}
  <span>Make text bold</span>
{/snippet}
{#snippet italicContent()}
  <span>Apply italic formatting to text</span>
{/snippet}
{#snippet underlineContent()}
  <span>Underline text</span>
{/snippet}
<Tooltip.Provider
  ><ToggleGroup.Root defaultValue={["bold"]} multiple
    >{#each controls as control, index}
      <Tooltip.Trigger
        as="span"
        class="contents"
        handle={tooltipHandle}
        payload={[boldContent, italicContent, underlineContent][index]}
        ><ToggleGroup.Item
          aria-describedby="formatting-tooltip"
          aria-label={control.label}
          class="after:absolute after:left-full after:h-full after:w-1"
          value={control.value}
          ><HugeiconsIcon
            aria-hidden="true"
            icon={control.icon}
            strokeWidth={2}
          /></ToggleGroup.Item
        ></Tooltip.Trigger
      >
    {/each}</ToggleGroup.Root
  ><Tooltip.Root handle={tooltipHandle}
    >{#snippet children({ payload })}
      <Tooltip.Popup id="formatting-tooltip"
        >{#if payload}
          {@render payload()}
        {/if}</Tooltip.Popup
      >
    {/snippet}</Tooltip.Root
  ></Tooltip.Provider
>
