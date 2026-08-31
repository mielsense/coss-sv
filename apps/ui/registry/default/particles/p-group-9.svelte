<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "group"],
    id: "p-group-9",
    interactive: true,
    responsive: false,
    title: "Vertical group",
  });
</script>

<script lang="ts">
  import { Button, Group, HugeiconsIcon } from "@coss-sv/ui";
  import ZoomInIcon from "@hugeicons/core-free-icons/ZoomInIcon";
  import ZoomOutIcon from "@hugeicons/core-free-icons/ZoomOutIcon";
</script>

<Group.Root aria-label="Zoom controls" orientation="vertical">
  <Button aria-label="Zoom in" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={ZoomInIcon} strokeWidth={2} />
  </Button>
  <Group.Separator orientation="horizontal" />
  <Button aria-label="Zoom Out" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={ZoomOutIcon} strokeWidth={2} />
  </Button>
</Group.Root>
