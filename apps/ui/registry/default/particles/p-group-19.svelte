<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["group", "input", "select"],
    id: "p-group-19",
    interactive: true,
    responsive: false,
    title: "Group with input and select",
  });
</script>

<script lang="ts">
  import { Group, Input, Select } from "@coss-sv/ui";

  const domains = [
    { label: ".com", value: "com" },
    { label: ".org", value: "org" },
    { label: ".net", value: "net" },
  ];
  let domain = $state("com");
</script>

<Group.Root aria-label="Domain input">
  <Input aria-label="Domain name" placeholder="example" type="text" />
  <Group.Separator />
  <Select.Root bind:value={domain} items={domains}>
    <Select.Trigger class="w-fit min-w-none"><Select.Value /></Select.Trigger>
    <Select.Popup
      >{#each domains as item (item.value)}
        <Select.Item value={item.value}>{item.label}</Select.Item>
      {/each}</Select.Popup
    >
  </Select.Root>
</Group.Root>
