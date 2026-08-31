<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "group"],
    id: "p-group-10",
    interactive: true,
    responsive: false,
    title: "Nested groups",
  });
</script>

<script lang="ts">
  import { Button, Group, HugeiconsIcon } from "@coss-sv/ui";
  import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
  import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
</script>

<Group.Root aria-label="Pagination">
  <Group.Root aria-label="Page numbers">
    {#each [1, 2, 3, 4, 5] as page (page)}
      {#if page > 1}
        <Group.Separator />
      {/if}
      <Button class="min-w-8" variant="outline">{page}</Button>
    {/each}
  </Group.Root>
  <Group.Root aria-label="Navigation">
    <Button aria-label="Previous" size="icon" variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} strokeWidth={2} />
    </Button>
    <Group.Separator />
    <Button aria-label="Next" size="icon" variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} />
    </Button>
  </Group.Root>
</Group.Root>
