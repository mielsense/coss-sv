<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-17",
    interactive: true,
    responsive: false,
    title: "Select with country flags",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const countries = [
    {
      continent: "America",
      items: [
        { flag: "🇺🇸", label: "United States", value: "us" },
        { flag: "🇨🇦", label: "Canada", value: "ca" },
        { flag: "🇲🇽", label: "Mexico", value: "mx" },
      ],
    },
    {
      continent: "Europe",
      items: [
        { flag: "🇬🇧", label: "United Kingdom", value: "gb" },
        { flag: "🇫🇷", label: "France", value: "fr" },
        { flag: "🇩🇪", label: "Germany", value: "de" },
      ],
    },
    {
      continent: "Asia",
      items: [
        { flag: "🇨🇳", label: "China", value: "cn" },
        { flag: "🇯🇵", label: "Japan", value: "jp" },
        { flag: "🇮🇳", label: "India", value: "in" },
      ],
    },
  ];
  const allItems = countries.flatMap((group) => group.items);
  type Item = (typeof allItems)[number];
</script>

<Select.Root
  aria-label="Select country"
  value={allItems.find((item) => item.value === "ca")}
  itemToStringValue={(item: Item) => item.value}
  ><Select.Trigger
    ><Select.Value
      >{#snippet children(item: Item | null)}{#if item}<span class="flex items-center gap-2"
            ><span class="text-base leading-none">{item.flag}</span><span class="truncate"
              >{item.label}</span
            ></span
          >{/if}{/snippet}</Select.Value
    ></Select.Trigger
  ><Select.Popup
    >{#each countries as group, index (group.continent)}<Select.Group
        >{#if index > 0}<Select.Separator />{/if}<Select.GroupLabel
          >{group.continent}</Select.GroupLabel
        >{#each group.items as item (item.value)}<Select.Item value={item}
            ><span class="flex items-center gap-2"
              ><span class="text-base leading-none">{item.flag}</span><span class="truncate"
                >{item.label}</span
              ></span
            ></Select.Item
          >{/each}</Select.Group
      >{/each}</Select.Popup
  ></Select.Root
>
