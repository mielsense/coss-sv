<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-18",
    interactive: true,
    responsive: false,
    title: "Combobox with select trigger",
  });
</script>

<script lang="ts">
  import { Combobox, HugeiconsIcon, Select } from "@coss-sv/ui";
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
</script>

<Combobox.Root autoHighlight {items}>
  <Combobox.Trigger class={Select.selectTriggerClass}
    ><Combobox.Value placeholder="Select a fruit" /></Combobox.Trigger
  >
  <Combobox.Popup aria-label="Select a fruit">
    <div class="border-b p-2">
      <Combobox.Input
        class="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
        placeholder="Search fruits..."
        showTrigger={false}
      >
        {#snippet startAddon()}<HugeiconsIcon
            aria-hidden="true"
            icon={Search01Icon}
            strokeWidth={2}
          />{/snippet}
      </Combobox.Input>
    </div>
    <Combobox.Empty>No items found.</Combobox.Empty><Combobox.List
      ><Combobox.Collection>
        {#snippet children(item: Item)}<Combobox.Item value={item}>{item.label}</Combobox.Item
          >{/snippet}
      </Combobox.Collection></Combobox.List
    >
  </Combobox.Popup>
</Combobox.Root>
