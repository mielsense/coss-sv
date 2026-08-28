<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-9",
    interactive: true,
    responsive: false,
    title: "Select options with icon",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";
  import { CodeIcon, GlobeIcon, Layers01Icon, ZapIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  const items = [
    { icon: Layers01Icon, label: "Components", value: "components" },
    { icon: ZapIcon, label: "Performance", value: "performance" },
    { icon: GlobeIcon, label: "Network", value: "network" },
    { icon: CodeIcon, label: "Development", value: "development" },
  ];
  type Item = (typeof items)[number];
</script>

<Select.Root
  aria-label="Select category"
  value={items[0]}
  itemToStringValue={(item: Item) => item.value}
>
  <Select.Trigger
    ><Select.Value
      >{#snippet children(item: Item | null)}{#if item}<span class="flex items-center gap-2"
            ><HugeiconsIcon aria-hidden="true" icon={item.icon} strokeWidth={2} /><span
              class="truncate">{item.label}</span
            ></span
          >{/if}{/snippet}</Select.Value
    ></Select.Trigger
  >
  <Select.Popup
    >{#each items as item (item.value)}<Select.Item value={item}
        ><span class="flex items-center gap-2"
          ><HugeiconsIcon aria-hidden="true" icon={item.icon} strokeWidth={2} /><span
            class="truncate">{item.label}</span
          ></span
        ></Select.Item
      >{/each}</Select.Popup
  ></Select.Root
>
