<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["group", "input", "label"],
    id: "p-group-8",
    interactive: true,
    responsive: false,
    title: "Group with end text",
  });
</script>

<script lang="ts">
  import { Group, type GroupTextDelegateProps, Input, Label } from "@coss-sv/ui";
</script>

<Group.Root aria-label="Domain input">
  <Input aria-label="Domain" value="coss" id="domain-suffix" type="text" />
  <Group.Separator />
  <Group.Text aria-label="Domain suffix" delegate={labelDelegate} for="domain-suffix"
    >.com</Group.Text
  >
</Group.Root>

{#snippet labelDelegate(props: GroupTextDelegateProps)}
  <Label {...props} />
{/snippet}
