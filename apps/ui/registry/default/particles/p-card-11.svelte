<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "card", "empty"],
  containerClass:
    "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
  id: "p-card-11",
  interactive: true,
  responsive: true,
  title: "CardFrame with header action",
});
</script>

<script lang="ts">
import {
  Button,
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@coss-sv/ui";
</script>

<CardFrame class="w-full">
  <CardFrameHeader>
    <CardFrameTitle>Project</CardFrameTitle>
    <CardFrameDescription>Manage your projects</CardFrameDescription>
    <CardFrameAction>
      <Button variant="outline">
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        ><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
        Add
      </Button>
    </CardFrameAction>
  </CardFrameHeader>
  <Card>
    <CardPanel>
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
            ><path d="M10 4H2v16h20V6H12l-2-2z"></path></svg>
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Get started by adding your first project.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </CardPanel>
  </Card>
</CardFrame>
