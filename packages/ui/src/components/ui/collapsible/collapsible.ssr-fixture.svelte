<script lang="ts">
import Button from "../button/button.svelte";
import * as Collapsible from "./index.js";
</script>

<Collapsible.Root aria-label="Recovery keys" open>
  <Collapsible.Trigger>Show recovery keys</Collapsible.Trigger>
  <Collapsible.Panel>4829-1735-6621</Collapsible.Panel>
</Collapsible.Root>

<Collapsible.Root disabled>
  <Collapsible.Trigger>
    {#snippet children()}
      Disabled delegated trigger
    {/snippet}
    {#snippet delegate({ props, ref })}
      <Button
        {...props}
        bind:ref={ref.current}
        data-testid="ssr-disabled-delegate"
        variant="ghost"
      />
    {/snippet}
  </Collapsible.Trigger>
  <Collapsible.Panel>Disabled delegated panel</Collapsible.Panel>
</Collapsible.Root>

<Collapsible.Root open>
  <Collapsible.Trigger class="consumer-trigger">
    {#snippet children()}
      Delegated trigger
    {/snippet}
    {#snippet delegate({ props, ref })}
      <Button {...props} bind:ref={ref.current} variant="ghost" />
    {/snippet}
  </Collapsible.Trigger>
  <Collapsible.Panel>Delegated panel</Collapsible.Panel>
</Collapsible.Root>
