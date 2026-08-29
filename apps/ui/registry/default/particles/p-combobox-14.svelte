<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-14",
    interactive: true,
    responsive: false,
    title: "Combobox multiple with start addon",
  });
</script>

<script lang="ts">
  import { Combobox, HugeiconsIcon } from "@coss-sv/ui";
  import { Search01Icon } from "@hugeicons/core-free-icons";

  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Mango", value: "mango" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Kiwi", value: "kiwi" },
    { label: "Peach", value: "peach" },
    { label: "Pear", value: "pear" },
  ] as const;
  type Item = (typeof items)[number];
  let value = $state<Item[]>([items[0], items[3]]);
</script>

<Combobox.Root {items} multiple bind:value name="fruits">
  <Combobox.Chips>
    {#snippet startAddon()}<HugeiconsIcon
        aria-hidden="true"
        icon={Search01Icon}
        strokeWidth={2}
      />{/snippet}
    {#each value as item (item.value)}<Combobox.Chip aria-label={item.label}
        >{item.label}</Combobox.Chip
      >{/each}
    <Combobox.ChipsInput
      aria-label="Select a item"
      placeholder={value.length ? undefined : "Select a item..."}
    />
  </Combobox.Chips>
  <Combobox.Popup
    ><Combobox.Empty>No items found.</Combobox.Empty><Combobox.List
      ><Combobox.Collection>
        {#snippet children(item: Item)}<Combobox.Item value={item}>{item.label}</Combobox.Item
          >{/snippet}
      </Combobox.Collection></Combobox.List
    ></Combobox.Popup
  >
</Combobox.Root>
