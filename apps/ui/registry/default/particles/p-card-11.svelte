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
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import { Add01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
</script>

<CardFrame class="w-full">
  <CardFrameHeader>
    <CardFrameTitle>Project</CardFrameTitle>
    <CardFrameDescription>Manage your projects</CardFrameDescription>
    <CardFrameAction>
      <Button variant="outline">
        <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
        Add
      </Button>
    </CardFrameAction>
  </CardFrameHeader>
  <Card>
    <CardPanel>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon aria-hidden="true" icon={Folder01Icon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Get started by adding your first project.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </CardPanel>
  </Card>
</CardFrame>
