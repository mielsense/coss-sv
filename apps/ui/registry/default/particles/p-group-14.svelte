<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "number-field", "select"],
  id: "p-group-14",
  interactive: true,
  responsive: false,
  title: "Group with select",
});
</script>
<script lang="ts">
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Group, NumberField, Select } from "@coss-sv/ui";

interface Currency {
  value: string;
  label: string;
}
const currencies: Currency[] = [
  { label: "US Dollar", value: "$" },
  { label: "Euro", value: "€" },
  { label: "British Pound", value: "£" },
];
let currency = $state<Currency | null>(currencies[0]);
</script>
<Group.Root aria-label="Payment amount">
  <Group.Root aria-label="Amount input">
    <Select.Root
      bind:value={currency}
      items={currencies.map((item) => ({ label: item.label, value: item }))}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
    >
      <Select.Trigger class="w-fit min-w-none">
        <Select.Value>
          {#snippet children(value: Currency | null)}
            {value?.value}
          {/snippet}
        </Select.Value>
      </Select.Trigger>
      <Select.Popup class="min-w-48">
        {#each currencies as item (item.value)}
          <Select.Item value={item}
            >{item.value} <span class="ms-1">{item.label}</span></Select.Item
          >
        {/each}
      </Select.Popup>
    </Select.Root>
    <Group.Separator />
    <NumberField.Root aria-label="Enter the amount" class="gap-0" defaultValue={10}>
      <NumberField.Group><NumberField.Input class="text-left" /></NumberField.Group>
    </NumberField.Root>
  </Group.Root>
  <Group.Root aria-label="Submit">
    <Button aria-label="Send" size="icon" variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} />
    </Button>
  </Group.Root>
</Group.Root>
