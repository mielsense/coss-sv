<script lang="ts">
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "../../../../../../packages/ui/dist/components/ui/frame/index.js";
</script>

<div class="frame-review-shell">
  <div class="frame-particle-shell">
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
  </div>
</div>

<style>
.frame-review-shell {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 24rem;
  align-items: center;
  justify-content: center;
}

.frame-particle-shell {
  width: 42.875rem;
  max-width: 100%;
}

@media (width < 40rem) {
  .frame-particle-shell {
    width: 19.25rem;
  }
}
</style>
