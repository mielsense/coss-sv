<script lang="ts">
import Button from "../button/button.svelte";
import * as Collapsible from "./index.js";

let open = $state(false);
let changes = $state<boolean[]>([]);
let cancelledClicks = $state(0);
let cancelledOpen = $state(false);
let customOpen = $state(true);
let delegatedClicks = $state(0);
let delegatedRef = $state<HTMLElement | null>(null);
let disabledClicks = $state(0);
let deferredOpen = $state<boolean | undefined>();
let showCustomPanel = $state(true);
let showDelegated = $state(true);

function cancelToggle(event: MouseEvent & { preventShardsUIHandler?: () => void }): void {
  cancelledClicks += 1;
  event.preventShardsUIHandler?.();
}
</script>

<Collapsible.Root aria-label="Recovery keys" bind:open onOpenChange={(next) => changes.push(next)}>
  <Collapsible.Trigger>Show recovery keys</Collapsible.Trigger>
  <Collapsible.Panel data-testid="panel" keepMounted>
    <span>4829-1735-6621</span>
  </Collapsible.Panel>
</Collapsible.Root>

<Collapsible.Root disabled>
  <Collapsible.Trigger>Disabled recovery keys</Collapsible.Trigger>
  <Collapsible.Panel>Disabled content</Collapsible.Panel>
</Collapsible.Root>

<Collapsible.Root bind:open={deferredOpen}>
  <Collapsible.Trigger>Deferred recovery keys</Collapsible.Trigger>
  <Collapsible.Panel>Deferred content</Collapsible.Panel>
</Collapsible.Root>

{#if showDelegated}
  <Collapsible.Root>
    <Collapsible.Trigger
      bind:ref={delegatedRef}
      class="data-panel-open:[&_svg]:rotate-180"
      onclick={() => (delegatedClicks += 1)}
    >
      {#snippet children()}
        <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
        Delegated section
      {/snippet}
      {#snippet delegate({ props, ref, state })}
        <Button
          {...props}
          bind:ref={ref.current}
          data-delegate-state={state.open ? "open" : "closed"}
          data-testid="delegated-trigger"
          variant="ghost"
        />
      {/snippet}
    </Collapsible.Trigger>
    <Collapsible.Panel data-testid="delegated-panel">Delegated content</Collapsible.Panel>
  </Collapsible.Root>
{/if}

<Collapsible.Root disabled>
  <Collapsible.Trigger onclick={() => (disabledClicks += 1)}>
    {#snippet children()}
      Disabled delegated section
    {/snippet}
    {#snippet delegate({ props, ref })}
      <Button {...props} bind:ref={ref.current} data-testid="delegated-disabled" variant="ghost" />
    {/snippet}
  </Collapsible.Trigger>
  <Collapsible.Panel>Disabled delegated content</Collapsible.Panel>
</Collapsible.Root>

<Collapsible.Root bind:open={cancelledOpen}>
  <Collapsible.Trigger onclick={cancelToggle}>
    {#snippet children()}
      Cancelled delegated section
    {/snippet}
    {#snippet delegate({ props, ref })}
      <Button {...props} bind:ref={ref.current} data-testid="delegated-cancelled" variant="ghost" />
    {/snippet}
  </Collapsible.Trigger>
  <Collapsible.Panel>Cancelled delegated content</Collapsible.Panel>
</Collapsible.Root>

<Collapsible.Root bind:open={customOpen}>
  <Collapsible.Trigger>
    {#snippet children()}
      Custom id delegated section
    {/snippet}
    {#snippet delegate({ props, ref })}
      <Button {...props} bind:ref={ref.current} data-testid="delegated-custom-id" variant="ghost" />
    {/snippet}
  </Collapsible.Trigger>
  {#if showCustomPanel}
    <Collapsible.Panel id="custom-delegated-panel">Custom id delegated content</Collapsible.Panel>
  {/if}
</Collapsible.Root>

<button
  data-testid="toggle-delegated"
  onclick={() => (showDelegated = !showDelegated)}
  type="button"
>
  Toggle delegated trigger
</button>
<button
  data-testid="toggle-custom-panel"
  onclick={() => (showCustomPanel = !showCustomPanel)}
  type="button"
>
  Toggle custom panel
</button>

<output data-testid="open-state">{open ? "open" : "closed"}</output>
<output data-testid="changes">{changes.join(",")}</output>
<output data-testid="deferred-open">{deferredOpen == null ? "unset" : deferredOpen}</output>
<output data-testid="delegated-state"
  >{delegatedClicks}:{delegatedRef?.tagName ?? "missing"}</output
>
<output data-testid="delegated-disabled-clicks">{disabledClicks}</output>
<output data-testid="delegated-cancelled-state">{cancelledClicks}:{cancelledOpen}</output>
