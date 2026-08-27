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
</script>

<div class="empty-review-shell">
  <div class="empty-particle-shell">
    <Empty data-anchor="p-empty-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg
            aria-hidden="true"
            class="lucide lucide-route"
            fill="none"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="19" r="3"></circle>
            <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
            <circle cx="18" cy="5" r="3"></circle>
          </svg>
        </EmptyMedia>
        <EmptyTitle>No upcoming meetings</EmptyTitle>
        <EmptyDescription>Create a meeting to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <CossButton size="sm">Create meeting</CossButton>
          <CossButton size="sm" variant="outline">
            <svg
              aria-hidden="true"
              class="lucide lucide-book"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
              ></path>
            </svg>
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
