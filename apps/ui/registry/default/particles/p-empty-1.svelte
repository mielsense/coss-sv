<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

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
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
  import Route01Icon from "@hugeicons/core-free-icons/Route01Icon";
</script>

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <HugeiconsIcon aria-hidden="true" icon={Route01Icon} strokeWidth={2} />
    </EmptyMedia>
    <EmptyTitle>No upcoming meetings</EmptyTitle>
    <EmptyDescription>Create a meeting to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <div class="flex gap-2">
      <Button size="sm">Create meeting</Button>
      <Button size="sm" variant="outline">
        <HugeiconsIcon aria-hidden="true" icon={BookOpen01Icon} strokeWidth={2} />
        View docs
      </Button>
    </div>
  </EmptyContent>
</Empty>
