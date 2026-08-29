<script lang="ts">
  import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from "../../../../../../packages/ui/dist/components/ui/empty/index.js";
  import CossButton from "./c1-button.svelte";
  import FixtureIcon from "./fixture-icon.svelte";
</script>

<div class="empty-review-shell">
  <div class="empty-particle-shell">
    <Empty data-anchor="p-empty-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FixtureIcon aria-hidden="true" name="route" />
        </EmptyMedia>
        <EmptyTitle>No upcoming meetings</EmptyTitle>
        <EmptyDescription>Create a meeting to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <CossButton size="sm">Create meeting</CossButton>
          <CossButton size="sm" variant="outline">
            <FixtureIcon aria-hidden="true" name="book" />
            View docs
          </CossButton>
        </div>
      </EmptyContent>
    </Empty>
  </div>
</div>

<style>
  .empty-review-shell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-height: 24rem;
    align-items: center;
    justify-content: center;
  }

  .empty-particle-shell {
    width: max-content;
  }
</style>
