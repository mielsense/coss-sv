<script lang="ts">
import ScrollArea from "./scroll-area.svelte";

let clicks = $state(0);
let rootRef = $state<HTMLElement | null>(null);
</script>

<ScrollArea
  aria-label="Bidirectional content"
  bind:ref={rootRef}
  class="both"
  data-testid="both-root"
  onclick={() => (clicks += 1)}
  overscrollContain
  scrollbarGutter
  scrollFade
>
  <div class="both-content">Both axes</div>
</ScrollArea>

<ScrollArea aria-label="Static content" class="static" data-testid="static-root">
  <div class="static-content">No overflow</div>
</ScrollArea>

<ScrollArea aria-label="Horizontal content" class="horizontal" data-testid="horizontal-root">
  <div class="horizontal-content">Horizontal overflow</div>
</ScrollArea>

<div class="auto-height-particle">
  <ScrollArea aria-label="Plain particle" class="auto-height-root" data-testid="plain-auto-root">
    <div class="particle-content">Plain particle</div>
  </ScrollArea>
</div>

<div class="auto-height-particle">
  <ScrollArea
    aria-label="Gutter particle"
    class="auto-height-root"
    data-testid="gutter-auto-root"
    scrollbarGutter
  >
    <div class="particle-content">Gutter particle</div>
  </ScrollArea>
</div>

<output data-testid="state">{clicks}:{rootRef?.tagName ?? "missing"}</output>

<style>
:global([data-testid="both-root"]) {
  width: 120px;
  height: 80px;
}

:global([data-testid="both-root"] [data-slot="scroll-area-viewport"]),
:global([data-testid="static-root"] [data-slot="scroll-area-viewport"]),
:global([data-testid="horizontal-root"] [data-slot="scroll-area-viewport"]) {
  height: 100%;
}

:global([data-slot="scroll-area-scrollbar"]) {
  display: flex;
}

:global([data-slot="scroll-area-scrollbar"][data-orientation="vertical"]) {
  width: 6px;
}

:global([data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]) {
  height: 6px;
  flex-direction: column;
}

:global([data-slot="scroll-area-thumb"]) {
  flex: 1;
}

.both-content {
  width: 360px;
  height: 240px;
}

:global([data-testid="static-root"]) {
  width: 120px;
  height: 80px;
}

.static-content {
  width: 60px;
  height: 40px;
}

:global([data-testid="horizontal-root"]) {
  width: 120px;
  height: 80px;
}

.horizontal-content {
  width: 360px;
  height: 40px;
}

.auto-height-particle {
  width: 384px;
}

:global(.auto-height-root) {
  box-sizing: border-box;
  width: 384px;
  height: auto;
  border: 1px solid;
}

:global(.auto-height-root [data-slot="scroll-area-viewport"]) {
  box-sizing: border-box;
  height: auto;
}

:global([data-testid="gutter-auto-root"] [data-slot="scroll-area-viewport"][data-has-overflow-x]) {
  padding-bottom: 10px;
}

.particle-content {
  width: 2896px;
  height: 112px;
}
</style>
