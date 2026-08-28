<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-14",
    interactive: true,
    responsive: false,
    title: "Status select with colored dot",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { color: "bg-emerald-500", label: "Completed", value: "completed" },
    { color: "bg-blue-500", label: "In Progress", value: "in-progress" },
    { color: "bg-amber-500", label: "Pending", value: "pending" },
    { color: "bg-gray-500", label: "Cancelled", value: "cancelled" },
    { color: "bg-red-500", label: "Failed", value: "failed" },
  ];
  type Item = (typeof items)[number];
</script>

<Select.Root
  aria-label="Select status"
  value={items[0]}
  itemToStringValue={(item: Item) => item.value}
  ><Select.Trigger
    ><Select.Value
      >{#snippet children(item: Item | null)}{#if item}<span class="flex items-center gap-2"
            ><span aria-hidden="true" class={["size-2 rounded-full", item.color]}></span><span
              class="truncate">{item.label}</span
            ></span
          >{/if}{/snippet}</Select.Value
    ></Select.Trigger
  ><Select.Popup
    >{#each items as item (item.value)}<Select.Item value={item}
        ><span class="flex items-center gap-2"
          ><span aria-hidden="true" class={["size-2 rounded-full", item.color]}></span><span
            class="truncate">{item.label}</span
          ></span
        ></Select.Item
      >{/each}</Select.Popup
  ></Select.Root
>
