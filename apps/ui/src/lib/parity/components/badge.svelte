<script lang="ts">
  import { Badge } from "../../../../../../packages/ui/dist/components/ui/badge/index.js";
  import FixtureIcon from "./fixture-icon.svelte";

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
    <FixtureIcon aria-hidden="true" name="check" />
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
</style>
