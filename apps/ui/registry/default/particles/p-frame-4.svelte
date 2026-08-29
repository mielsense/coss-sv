<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["frame", "separator"],
    containerClass: "**:data-[slot=preview]:w-full",
    id: "p-frame-4",
    interactive: false,
    responsive: true,
    title: "Frame with multiple stacked panels",
  });
</script>

<script lang="ts">
  import {
    Frame,
    FrameDescription,
    FrameHeader,
    FramePanel,
    FrameTitle,
    Separator,
  } from "@coss-sv/ui";
</script>

<Frame class="w-full">
  <FrameHeader>
    <FrameTitle>Section header</FrameTitle>
    <FrameDescription>Brief description about the section</FrameDescription>
  </FrameHeader>
  <FramePanel class="p-0">
    <div class="p-5">
      <h2 class="font-semibold text-sm">Stacked panel</h2>
      <p class="text-muted-foreground text-sm">Section description</p>
    </div>
    <Separator />
    <div class="p-5">
      <h2 class="font-semibold text-sm">Stacked panel</h2>
      <p class="text-muted-foreground text-sm">Section description</p>
    </div>
  </FramePanel>
</Frame>
