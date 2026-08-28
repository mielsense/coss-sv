<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "input", "select"],
  id: "p-group-15",
  interactive: true,
  responsive: false,
  title: "Group with search",
});
</script>
<script lang="ts">
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Group, Input, Select } from "@coss-sv/ui";
const protocols = [
  { label: "http", value: "http" },
  { label: "https", value: "https" },
  { label: "http + https", value: "both" },
];
const subdomains = [
  { label: "Subdomains", value: null },
  { label: "www", value: "www" },
  { label: "api", value: "api" },
  { label: "cdn", value: "cdn" },
];
let protocol = $state("both");
let subdomain = $state<string | null>(null);
</script>
<Group.Root aria-label="URL search">
  <Select.Root bind:value={protocol} items={protocols}>
    <Select.Trigger class="w-fit min-w-none"><Select.Value /></Select.Trigger>
    <Select.Popup
      >{#each protocols as item (item.value)}
        <Select.Item value={item.value}>{item.label}</Select.Item>
      {/each}</Select.Popup
    >
  </Select.Root>
  <Group.Separator />
  <Input aria-label="URL" class="flex-1" value="coss.com" type="text" />
  <Group.Separator />
  <Select.Root bind:value={subdomain} items={subdomains}>
    <Select.Trigger class="w-fit min-w-none"><Select.Value /></Select.Trigger>
    <Select.Popup
      >{#each subdomains as item (item.value)}
        <Select.Item value={item.value}>{item.label}</Select.Item>
      {/each}</Select.Popup
    >
  </Select.Root>
  <Group.Separator />
  <Button aria-label="Search" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
  </Button>
</Group.Root>
