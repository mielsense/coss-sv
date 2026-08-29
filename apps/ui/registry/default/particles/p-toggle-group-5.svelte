<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle-group"],
    id: "p-toggle-group-5",
    interactive: true,
    responsive: false,
    title: "Vertical toggle group",
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

<ToggleGroup.Root defaultValue={["bold"]} orientation="vertical" variant="outline">
  {#each tools as tool, index (tool.value)}
    {#if index > 0}
      <ToggleGroup.Separator orientation={"horizontal"} />
    {/if}
    <ToggleGroup.Item aria-label={tool.label} disabled={false} value={tool.value} title={undefined}>
      <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
