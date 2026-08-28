<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-8",
    interactive: true,
    responsive: false,
    title: "Select with icon",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";
  import { CableIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  const items = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Astro", value: "astro" },
  ];
</script>

<Select.Root aria-label="Select framework with icon" value="next" {items}
  ><Select.Trigger
    ><HugeiconsIcon aria-hidden="true" icon={CableIcon} strokeWidth={2} /><Select.Value
    /></Select.Trigger
  ><Select.Popup alignItemWithTrigger={false}
    >{#each items as item (item.value)}<Select.Item value={item.value}>{item.label}</Select.Item
      >{/each}</Select.Popup
  ></Select.Root
>
