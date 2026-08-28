<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-18",
    interactive: true,
    responsive: false,
    title: "Select with description in options only",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { description: "Ideal for individuals", label: "Standard Plan", value: "standard" },
    { description: "For professional users", label: "Pro Plan", value: "pro" },
    { description: "Built for large teams", label: "Enterprise Plan", value: "enterprise" },
  ];
  type Item = (typeof items)[number];
</script>

<Select.Root
  aria-label="Select plan"
  value={items[1]}
  itemToStringValue={(item: Item) => item.value}
  ><Select.Trigger
    ><Select.Value
      >{#snippet children(item: Item | null)}{#if item}<span class="truncate">{item.label}</span
          >{/if}{/snippet}</Select.Value
    ></Select.Trigger
  ><Select.Popup alignItemWithTrigger={false}
    >{#each items as item (item.value)}<Select.Item value={item}
        ><span class="flex flex-col"
          ><span class="truncate">{item.label}</span><span
            class="truncate text-muted-foreground text-xs">{item.description}</span
          ></span
        ></Select.Item
      >{/each}</Select.Popup
  ></Select.Root
>
