<script lang="ts">
  import {
    Frame,
    FrameDescription,
    FrameFooter,
    FrameHeader,
    FramePanel,
    FrameTitle,
  } from "./index.js";

  let clicks = $state(0);
  let frameRef = $state<HTMLDivElement | null>(null);
  let panelRef = $state<HTMLDivElement | null>(null);
</script>

<Frame bind:ref={frameRef} data-testid="frame">
  <FrameHeader>
    <FrameTitle>Section header</FrameTitle>
    <FrameDescription>Brief description</FrameDescription>
  </FrameHeader>
  <FramePanel bind:ref={panelRef} data-testid="frame-panel" onclick={() => (clicks += 1)}>
    Panel content
  </FramePanel>
  <FrameFooter>Footer</FrameFooter>
</Frame>

<output data-testid="frame-state"
  >{clicks}:{frameRef?.tagName ?? "missing"}:{panelRef?.tagName ?? "missing"}</output
>
