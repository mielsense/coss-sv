<script lang="ts">
  import * as PreviewCard from "./index.js";

  let portalTarget = $state<HTMLElement | null>(null);
</script>

<div bind:this={portalTarget} data-testid="preview-portal"></div>
<PreviewCard.Root>
  <PreviewCard.Trigger as="button" data-testid="preview-trigger" delay={0}
    >coss.com/ui</PreviewCard.Trigger
  >
  <PreviewCard.Popup portalProps={{ container: portalTarget }} side="right">
    <a href="/details">Beautifully designed components.</a>
  </PreviewCard.Popup>
</PreviewCard.Root>
