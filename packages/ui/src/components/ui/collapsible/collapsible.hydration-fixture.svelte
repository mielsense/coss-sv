<script lang="ts">
import * as Collapsible from "./index.js";
</script>

<Collapsible.Root data-hydration="collapsible-delegate" open>
  <Collapsible.Trigger>
    {#snippet children()}
      Hydration delegated trigger
    {/snippet}
    {#snippet delegate({ props, ref })}
      <button
        {...props}
        bind:this={ref.current}
        data-testid="hydration-delegated-trigger"
        type="button"
      >
        {@render props.children?.()}
      </button>
    {/snippet}
  </Collapsible.Trigger>
  <Collapsible.Panel id="hydration-delegated-panel" keepMounted>
    Hydration delegated panel
  </Collapsible.Panel>
</Collapsible.Root>
