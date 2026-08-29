<script lang="ts">
  import { Avatar } from "@coss-sv/ui";

  const referenceImage =
    "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80";
  let statuses = $state<string[]>([]);
  let showDelayed = $state(false);
</script>

<div data-particle="p-avatar-1">
  <Avatar.Root>
    <Avatar.Image alt="Luke Tracy" data-testid="avatar-image" src={referenceImage} />
    <Avatar.Fallback data-testid="avatar-fallback">LT</Avatar.Fallback>
  </Avatar.Root>
</div>

<div class="review-probes" data-review-probes="avatar">
  <Avatar.Root>
    <Avatar.Image
      alt="Broken"
      data-testid="avatar-error-image"
      src="data:image/png;base64,broken"
    />
    <Avatar.Fallback data-testid="avatar-error-fallback">ER</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image
      alt="Status"
      data-testid="avatar-status-image"
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='red'/%3E%3C/svg%3E"
      onLoadingStatusChange={(status) => statuses.push(status)}
    />
    <Avatar.Fallback delay={100} data-testid="avatar-delayed-fallback">DL</Avatar.Fallback>
  </Avatar.Root>
  <button type="button" data-testid="show-delayed-avatar" onclick={() => (showDelayed = true)}>
    Show delayed avatar
  </button>
  {#if showDelayed}
    <Avatar.Root>
      <Avatar.Image alt="Delayed failure" src="data:image/png;base64,broken" />
      <Avatar.Fallback delay={100} data-testid="avatar-delayed-fallback">DL</Avatar.Fallback>
    </Avatar.Root>
  {/if}
  <output data-testid="avatar-statuses">{statuses.join(",")}</output>
</div>

<style>
  .review-probes {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>
