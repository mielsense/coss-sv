<script lang="ts">
  import Button from "../button/button.svelte";
  import * as Pagination from "./index.js";

  let clicks = $state(0);
  let delegatedClicks = $state(0);
  let delegatedRef = $state<HTMLElement | null>(null);
  let linkRef = $state<HTMLElement | null>(null);
  let showDelegated = $state(true);
</script>

<Pagination.Root data-testid="root">
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.Previous href="#previous" />
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Link href="#page-1">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Link
        bind:ref={linkRef}
        data-testid="active"
        href="#page-2"
        isActive
        onclick={(event) => {
          event.preventDefault();
          clicks += 1;
        }}>2</Pagination.Link
      >
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Ellipsis />
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Next href="#next" />
    </Pagination.Item>
  </Pagination.Content>
</Pagination.Root>

<Pagination.Link as="button" data-testid="button-link" type="button">Load more</Pagination.Link>
<Pagination.Previous class="sm:*:[svg]:hidden">
  {#snippet delegate({ props })}
    <Button
      {...props}
      data-testid="delegated-previous"
      disabled
      onclick={() => (delegatedClicks += 10)}
      size="sm"
      variant="outline"
    />
  {/snippet}
</Pagination.Previous>
{#if showDelegated}
  <Pagination.Next bind:ref={delegatedRef} class="sm:*:[svg]:hidden">
    {#snippet delegate({ props, ref })}
      <Button
        {...props}
        bind:ref={ref.current}
        data-testid="delegated-next"
        onclick={() => (delegatedClicks += 1)}
        size="sm"
        variant="outline"
      />
    {/snippet}
  </Pagination.Next>
{/if}
<button
  data-testid="toggle-delegated"
  onclick={() => (showDelegated = !showDelegated)}
  type="button"
>
  Toggle delegated link
</button>
<output data-testid="state"
  >{clicks}:{linkRef?.tagName ?? "missing"}:{delegatedClicks}:{delegatedRef?.tagName ??
    "missing"}</output
>
