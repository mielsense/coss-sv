<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle-group"],
    id: "p-toggle-group-8",
    interactive: true,
    responsive: false,
    title: "Multiple toggle group",
  });
</script>

<script lang="ts">
  import { ToggleGroup, HugeiconsIcon } from "@coss-sv/ui";
  import { TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";

  const tools = [
    { icon: TextBoldIcon, label: "Toggle bold", value: "bold" },
    { icon: TextItalicIcon, label: "Toggle italic", value: "italic" },
    { icon: TextUnderlineIcon, label: "Toggle underline", value: "underline" },
  ];
</script>

<ToggleGroup.Root defaultValue={["bold"]} multiple>
  {#each tools as tool, index (tool.value)}
    <ToggleGroup.Item aria-label={tool.label} disabled={false} value={tool.value} title={undefined}>
      <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
