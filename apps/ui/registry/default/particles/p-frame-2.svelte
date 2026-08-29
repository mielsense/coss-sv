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
  import { Button, Collapsible, Frame, FrameHeader, FramePanel, HugeiconsIcon } from "@coss-sv/ui";
  import { ChevronDownIcon, TrashIcon } from "@hugeicons/core-free-icons";
</script>

<Frame class="w-full">
  <Collapsible.Root>
    <FrameHeader class="flex-row items-center justify-between px-2 py-2">
      <Collapsible.Trigger class="data-panel-open:[&_svg]:rotate-180">
        {#snippet children()}
          <HugeiconsIcon aria-hidden="true" class="size-4" icon={ChevronDownIcon} strokeWidth={2} />
          Section header
        {/snippet}
        {#snippet delegate({ props, ref })}
          <Button {...props} bind:ref={ref.current} variant="ghost" />
        {/snippet}
      </Collapsible.Trigger>
      <Button aria-label="Delete" size="icon" variant="ghost">
        <HugeiconsIcon aria-hidden="true" icon={TrashIcon} strokeWidth={2} />
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
