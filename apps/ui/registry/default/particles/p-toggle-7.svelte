<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["toggle"],
    id: "p-toggle-7",
    interactive: true,
    responsive: false,
    title: "Icon toggle group",
  });
</script>

<script lang="ts">
  import { Toggle, HugeiconsIcon } from "@coss-sv/ui";
  import { TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";

  const tools = [
    { icon: TextBoldIcon, label: "Toggle bold" },
    { icon: TextItalicIcon, label: "Toggle italic" },
    { icon: TextUnderlineIcon, label: "Toggle underline" },
  ];
</script>

<div class="flex items-center gap-1">
  {#each tools as tool (tool.label)}
    <Toggle aria-label={tool.label} variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={tool.icon} strokeWidth={2} />
    </Toggle>
  {/each}
</div>
