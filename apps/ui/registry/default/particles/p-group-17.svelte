<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["group", "input", "label"],
    id: "p-group-17",
    interactive: true,
    responsive: false,
    title: "Group with input and currency text",
  });
</script>

<script lang="ts">
  import { Group, type GroupTextDelegateProps, Input, Label } from "@coss-sv/ui";
</script>

<Group.Root aria-label="Price input">
  <Input aria-label="Enter the amount" class="text-right" value="100" id="amount" type="text" />
  <Group.Separator />
  <Group.Text aria-label="Currency" delegate={labelDelegate} for="amount">USD</Group.Text>
</Group.Root>

{#snippet labelDelegate(props: GroupTextDelegateProps)}
  <Label {...props} />
{/snippet}
