<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["group", "input", "select"],
    id: "p-group-18",
    interactive: true,
    responsive: false,
    title: "Group with select and input",
  });
</script>

<script lang="ts">
  import { Group, Input, Select } from "@coss-sv/ui";

  const protocols = [
    { label: "https://", value: "https" },
    { label: "http://", value: "http" },
    { label: "ftp://", value: "ftp" },
    { label: "sftp://", value: "sftp" },
  ];
  let protocol = $state("https");
</script>

<Group.Root aria-label="URL input">
  <Select.Root bind:value={protocol} items={protocols}>
    <Select.Trigger class="w-fit min-w-none"><Select.Value /></Select.Trigger>
    <Select.Popup
      >{#each protocols as item (item.value)}
        <Select.Item value={item.value}>{item.label}</Select.Item>
      {/each}</Select.Popup
    >
  </Select.Root>
  <Group.Separator />
  <Input aria-label="IP address" placeholder="192.168.1.1" type="text" />
</Group.Root>
