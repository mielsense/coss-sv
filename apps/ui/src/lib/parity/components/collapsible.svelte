<script lang="ts">
import { Button, Collapsible, Frame, FrameHeader, FramePanel } from "@coss-sv/ui";

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
        <svg
          aria-hidden="true"
          class="lucide lucide-chevron-down size-4"
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
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
              <svg
                aria-hidden="true"
                class="lucide lucide-chevron-down size-4"
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              Section header
            {/snippet}
            {#snippet delegate({ props, ref })}
              <Button {...props} bind:ref={ref.current} variant="ghost" />
            {/snippet}
          </Collapsible.Trigger>
          <Button aria-label="Delete" size="icon" variant="ghost">
            <svg
              aria-hidden="true"
              class="lucide lucide-trash"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
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
