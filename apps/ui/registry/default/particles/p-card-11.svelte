<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

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
  import * as Card from "@coss-sv/ui/components/ui/card";
  import {
    Button,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
  import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
</script>

<Card.Frame class="w-full">
  <Card.FrameHeader>
    <Card.FrameTitle>Project</Card.FrameTitle>
    <Card.FrameDescription>Manage your projects</Card.FrameDescription>
    <Card.FrameAction>
      <Button variant="outline">
        <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
        Add
      </Button>
    </Card.FrameAction>
  </Card.FrameHeader>
  <Card.Root>
    <Card.Panel>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon aria-hidden="true" icon={Folder01Icon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Get started by adding your first project.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Card.Panel>
  </Card.Root>
</Card.Frame>
