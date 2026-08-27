<script lang="ts">
import Label from "../label/label.svelte";
import type { GroupTextDelegateProps } from "./index.js";
import * as Group from "./index.js";
</script>

<Group.Root aria-label="Actions" orientation="vertical">
  <button data-slot="button" type="button">One</button>
  <Group.Separator orientation="horizontal" />
  <Group.Text as="span">Two</Group.Text>
</Group.Root>

<Group.Root aria-label="Domain input">
  <Group.Text aria-label="Domain" delegate={labelDelegate} for="domain">https://</Group.Text>
  <Group.Separator />
  <input aria-label="Domain" data-slot="input" id="domain">
</Group.Root>

{#snippet labelDelegate(props: GroupTextDelegateProps)}
  <Label {...props} />
{/snippet}
