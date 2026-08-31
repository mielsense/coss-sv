<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-16",
    interactive: true,
    responsive: false,
    title: "Select with left text label",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Go", value: "go" },
  ];
  type Item = (typeof items)[number];
</script>

<Select.Root
  aria-label="Select language"
  value={items[0]}
  itemToStringValue={(item: Item) => item.value}
>
  <Select.Trigger>
    <Select.Value>
      {#snippet children(item: Item | null)}{#if item}<span>
            <span class="text-muted-foreground">Language:</span>
            {item.label}
          </span>{/if}{/snippet}
    </Select.Value>
  </Select.Trigger><Select.Popup alignItemWithTrigger={false}>
    {#each items as item (item.value)}<Select.Item value={item}>{item.label}</Select.Item>{/each}
  </Select.Popup>
</Select.Root>
