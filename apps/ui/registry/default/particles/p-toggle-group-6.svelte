<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["toggle-group"],
  id: "p-toggle-group-6",
  interactive: true,
  responsive: false,
  title: "Disabled toggle group",
});
</script>

<script lang="ts">
import { ToggleGroup } from "@coss-sv/ui";
import { TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

const tools = [
  { icon: TextBoldIcon, label: "Toggle bold", value: "bold" },
  { icon: TextItalicIcon, label: "Toggle italic", value: "italic" },
  { icon: TextUnderlineIcon, label: "Toggle underline", value: "underline" },
];
</script>

<ToggleGroup.Root defaultValue={["bold"]} disabled>
  {#each tools as tool, index (tool.value)}
    <ToggleGroup.Item aria-label={tool.label} disabled={false} value={tool.value} title={undefined}>
      <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
