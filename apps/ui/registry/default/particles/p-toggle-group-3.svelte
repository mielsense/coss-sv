<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle-group"],
    id: "p-toggle-group-3",
    interactive: true,
    responsive: false,
    title: "Large toggle group",
  });
</script>

<script lang="ts">
  import { HugeiconsIcon, ToggleGroup } from "@coss-sv/ui";
  import TextBoldIcon from "@hugeicons/core-free-icons/TextBoldIcon";
  import TextItalicIcon from "@hugeicons/core-free-icons/TextItalicIcon";
  import TextUnderlineIcon from "@hugeicons/core-free-icons/TextUnderlineIcon";

  const tools = [
    { icon: TextBoldIcon, label: "Toggle bold", value: "bold" },
    { icon: TextItalicIcon, label: "Toggle italic", value: "italic" },
    { icon: TextUnderlineIcon, label: "Toggle underline", value: "underline" },
  ];
</script>

<ToggleGroup.Root defaultValue={["bold"]} size="lg">
  {#each tools as tool, index (tool.value)}
    <ToggleGroup.Item aria-label={tool.label} disabled={false} value={tool.value} title={undefined}>
      <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
