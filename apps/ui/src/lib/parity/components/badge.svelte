<script lang="ts">
import { Badge } from "../../../../../../packages/ui/dist/components/ui/badge/index.js";

const variants = [
  "default",
  "outline",
  "secondary",
  "destructive",
  "info",
  "success",
  "warning",
  "error",
] as const;
</script>

<div class="badge-gallery">
  {#each variants as variant (variant)}
    <Badge data-anchor={`badge-${variant}`} {variant}>Badge</Badge>
  {/each}
  <Badge data-anchor="badge-small" size="sm">Badge</Badge>
  <Badge data-anchor="badge-large" size="lg">Badge</Badge>
  <Badge data-anchor="badge-icon" variant="outline">
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg>
    Verified
  </Badge>
  <Badge as="a" data-anchor="badge-link" href="/">Badge</Badge>
  <Badge class="rounded-full" data-anchor="badge-count">7</Badge>
</div>

<style>
.badge-gallery {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 2rem;
}
svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
</style>
