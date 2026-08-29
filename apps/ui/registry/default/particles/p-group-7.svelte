<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["group", "input", "label"],
    id: "p-group-7",
    interactive: true,
    responsive: false,
    title: "Group with start text",
  });
</script>

<script lang="ts">
  import { Group, type GroupTextDelegateProps, Input, Label } from "@coss-sv/ui";
</script>

<Group.Root aria-label="Domain input">
  <Group.Text aria-label="Domain" delegate={labelDelegate} for="domain">https://</Group.Text>
  <Group.Separator />
  <Input aria-label="Domain" value="coss.com" id="domain" type="text" />
</Group.Root>

{#snippet labelDelegate(props: GroupTextDelegateProps)}
  <Label {...props} />
{/snippet}
