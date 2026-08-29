<script lang="ts">
  import Label from "../label/label.svelte";
  import type { GroupTextDelegateProps } from "./index.js";
  import * as Group from "./index.js";

  let delegatedRef = $state<HTMLElement | null>(null);
</script>

<Group.Root data-testid="default-group"
  ><button data-slot="button" type="button">Default</button></Group.Root
>
<Group.Root data-testid="vertical-group" orientation="vertical">
  <Group.Text as="label" data-testid="label-text">Label</Group.Text>
  <Group.Separator orientation="horizontal" />
  <button data-slot="button" type="button">Vertical</button>
</Group.Root>
<Group.Root aria-label="Delegated domain">
  <Group.Text
    bind:ref={delegatedRef}
    aria-label="Domain prefix"
    data-testid="delegated-label"
    delegate={labelDelegate}
    for="delegated-domain">https://</Group.Text
  >
  <input aria-label="Domain" id="delegated-domain" />
</Group.Root>
<output data-testid="delegated-ref">{delegatedRef?.tagName ?? "missing"}</output>

{#snippet labelDelegate(props: GroupTextDelegateProps)}
  <Label {...props} />
{/snippet}
