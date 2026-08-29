<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["frame"],
    containerClass: "**:data-[slot=preview]:w-full",
    id: "p-frame-1",
    interactive: false,
    responsive: true,
    title: "Basic frame",
  });
</script>

<script lang="ts">
  import {
    Frame,
    FrameDescription,
    FrameFooter,
    FrameHeader,
    FramePanel,
    FrameTitle,
  } from "@coss-sv/ui";
</script>

<Frame class="w-full">
  <FrameHeader>
    <FrameTitle>Section header</FrameTitle>
    <FrameDescription>Brief description about the section</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <h2 class="font-semibold text-sm">Section title</h2>
    <p class="text-muted-foreground text-sm">Section description</p>
  </FramePanel>
  <FrameFooter><p class="text-muted-foreground text-sm">Footer</p></FrameFooter>
</Frame>
