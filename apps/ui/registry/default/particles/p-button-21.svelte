<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-21",
    interactive: true,
    responsive: false,
    title: "Card-style button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
</script>

<Button class="h-auto! gap-4 px-4 py-3 text-left" variant="outline">
  <div class="flex flex-col gap-0.5">
    <h3>Talent Agency</h3>
    <p class="whitespace-break-spaces font-normal text-muted-foreground">Matches for your roster</p>
  </div>
  <HugeiconsIcon
    aria-hidden="true"
    class="transition-transform in-[[data-slot=button]:hover]:translate-x-0.5"
    icon={ArrowRight01Icon}
    strokeWidth={2}
  />
</Button>
