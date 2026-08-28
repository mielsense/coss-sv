<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "collapsible", "frame"],
  containerClass: "**:data-[slot=preview]:w-full",
  id: "p-frame-2",
  interactive: true,
  responsive: true,
  title: "Frame with collapsible content and delete button",
});
</script>

<script lang="ts">
import { Button, Collapsible, Frame, FrameHeader, FramePanel } from "@coss-sv/ui";
</script>

<Frame class="w-full">
  <Collapsible.Root>
    <FrameHeader class="flex-row items-center justify-between px-2 py-2">
      <Collapsible.Trigger class="data-panel-open:[&_svg]:rotate-180">
        {#snippet children()}
          <svg
            aria-hidden="true"
            class="size-4"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          ><path d="m6 9 6 6 6-6"></path></svg>
          Section header
        {/snippet}
        {#snippet delegate({ props, ref })}
          <Button {...props} bind:ref={ref.current} variant="ghost" />
        {/snippet}
      </Collapsible.Trigger>
      <Button aria-label="Delete" size="icon" variant="ghost">
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        ><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path
            d="M19 6 18 20H6L5 6"
          ></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
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
