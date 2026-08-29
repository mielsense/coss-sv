<script lang="ts">
  import { Button, Collapsible, Frame, FrameHeader, FramePanel } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  let isOpen = $state(false);
  let keepMountedOpen = $state(false);
</script>

<div class="collapsible-fixture">
  <section data-particle="p-collapsible-1">
    <Collapsible.Root bind:open={isOpen}>
      <Collapsible.Trigger
        class="inline-flex items-center gap-2 font-medium text-sm data-panel-open:[&_svg]:rotate-180"
        data-testid="collapsible-particle-trigger"
      >
        Show recovery keys
        <FixtureIcon aria-hidden="true" class="size-4" name="chevron-down" />
      </Collapsible.Trigger>
      <Collapsible.Panel data-testid="collapsible-particle-panel">
        <ul class="flex flex-col gap-1 py-2 text-muted-foreground text-sm">
          <li class="rounded-sm bg-muted px-2 py-1 font-mono">4829-1735-6621</li>
          <li class="rounded-sm bg-muted px-2 py-1 font-mono">9182-6407-5532</li>
          <li class="rounded-sm bg-muted px-2 py-1 font-mono">3051-7924-9018</li>
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  </section>

  <section data-particle="p-frame-2">
    <Frame class="w-full">
      <Collapsible.Root>
        <FrameHeader class="flex-row items-center justify-between px-2 py-2">
          <Collapsible.Trigger class="data-panel-open:[&_svg]:rotate-180">
            {#snippet children()}
              <FixtureIcon aria-hidden="true" class="size-4" name="chevron-down" />
              Section header
            {/snippet}
            {#snippet delegate({ props, ref })}
              <Button {...props} bind:ref={ref.current} variant="ghost" />
            {/snippet}
          </Collapsible.Trigger>
          <Button aria-label="Delete" size="icon" variant="ghost">
            <FixtureIcon aria-hidden="true" name="trash" />
          </Button>
        </FrameHeader>
        <Collapsible.Panel>
          <FramePanel>
            <h2 class="font-semibold text-sm">Section title</h2>
            <p class="text-muted-foreground text-sm">Section description</p>
          </FramePanel>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Frame>
  </section>

  <section class="review-probes" data-review-probes="collapsible">
    <div class="review-actions">
      <button type="button" onclick={() => (isOpen = !isOpen)}>Toggle upstream particle</button>
      <output data-testid="collapsible-controlled-value">{isOpen ? "open" : "closed"}</output>
    </div>
    <Collapsible.Root bind:open={keepMountedOpen}>
      <Collapsible.Trigger data-testid="collapsible-mounted-trigger">
        Keep-mounted lifecycle probe
      </Collapsible.Trigger>
      <Collapsible.Panel keepMounted data-testid="collapsible-mounted-panel">
        This panel stays mounted while closed for lifecycle and reduced-motion inspection.
      </Collapsible.Panel>
    </Collapsible.Root>
    <Collapsible.Root disabled>
      <Collapsible.Trigger data-testid="collapsible-disabled-trigger"
        >Disabled trigger</Collapsible.Trigger
      >
      <Collapsible.Panel>Disabled panel</Collapsible.Panel>
    </Collapsible.Root>
  </section>
</div>

<style>
  .collapsible-fixture {
    display: grid;
    box-sizing: border-box;
    width: 100%;
    min-height: 24rem;
    gap: 3rem;
    place-items: center;
    padding: 2rem;
  }

  .review-probes {
    display: grid;
    width: min(100%, 28rem);
    gap: 1rem;
    border-block-start: 1px solid var(--border);
    padding-block-start: 2rem;
  }

  .review-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }
</style>
