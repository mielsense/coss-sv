<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["collapsible"],
    id: "p-collapsible-1",
    interactive: true,
    responsive: false,
    title: "Basic collapsible",
  });
</script>

<script lang="ts">
  import { Collapsible, HugeiconsIcon } from "@coss-sv/ui";
  import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
</script>

<Collapsible.Root>
  <Collapsible.Trigger
    class="inline-flex items-center gap-2 font-medium text-sm data-panel-open:[&_svg]:rotate-180"
  >
    Show recovery keys
    <HugeiconsIcon aria-hidden="true" class="size-4" icon={ChevronDownIcon} strokeWidth={2} />
  </Collapsible.Trigger>
  <Collapsible.Panel>
    <ul class="flex flex-col gap-1 py-2 text-muted-foreground text-sm">
      <li class="rounded-sm bg-muted px-2 py-1 font-mono">4829-1735-6621</li>
      <li class="rounded-sm bg-muted px-2 py-1 font-mono">9182-6407-5532</li>
      <li class="rounded-sm bg-muted px-2 py-1 font-mono">3051-7924-9018</li>
    </ul>
  </Collapsible.Panel>
</Collapsible.Root>
