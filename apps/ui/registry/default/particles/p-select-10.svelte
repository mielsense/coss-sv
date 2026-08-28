<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-10",
    interactive: true,
    responsive: false,
    title: "Select with object values",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { description: "npx create-next-app", label: "Next.js", value: "next" },
    { description: "npm create vite@latest", label: "Vite", value: "vite" },
    { description: "npm create astro@latest", label: "Astro", value: "astro" },
    { description: "npx create-remix", label: "Remix", value: "remix" },
  ];
  type Item = (typeof items)[number];
</script>

<Select.Root
  aria-label="Select framework with command"
  value={items[0]}
  itemToStringValue={(item: Item) => item.value}
  ><Select.Trigger class="py-1"
    ><Select.Value
      >{#snippet children(item: Item | null)}{#if item}<span class="flex flex-col"
            ><span class="truncate">{item.label}</span><span
              class="truncate text-muted-foreground text-xs">{item.description}</span
            ></span
          >{/if}{/snippet}</Select.Value
    ></Select.Trigger
  ><Select.Popup
    >{#each items as item (item.value)}<Select.Item value={item}
        ><span class="flex flex-col"
          ><span class="truncate">{item.label}</span><span
            class="truncate text-muted-foreground text-xs">{item.description}</span
          ></span
        ></Select.Item
      >{/each}</Select.Popup
  ></Select.Root
>
