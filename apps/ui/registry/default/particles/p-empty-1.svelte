<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "empty"],
  id: "p-empty-1",
  interactive: true,
  responsive: true,
  title: "Empty state with icon and actions",
});
</script>

<script lang="ts">
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@coss-sv/ui";
</script>

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5c.4 0 .9-.1 1.3-.2"></path><path
          d="M5.2 16.1 5 15c-.1-.5.2-1 .7-1.1l9-2c.5-.1 1 .2 1.1.7l.4 1.7"
        ></path><path d="m14.4 7.1 1.5 2.8"></path><path d="m14.2 4.5 2.9-1.5"></path><path
          d="m16.7 10.5 1.5 2.8"
        ></path><path d="m18.6 6.4 2.8-1.5"></path><path d="m18.9 9 2.8-1.5"></path>
      </svg>
    </EmptyMedia>
    <EmptyTitle>No upcoming meetings</EmptyTitle>
    <EmptyDescription>Create a meeting to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <div class="flex gap-2">
      <Button size="sm">Create meeting</Button>
      <Button size="sm" variant="outline">
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        ><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
          ></path></svg>
        View docs
      </Button>
    </div>
  </EmptyContent>
</Empty>
