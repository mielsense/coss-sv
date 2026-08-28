<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "preview-card"],
    id: "p-preview-card-1",
    interactive: true,
    responsive: true,
    title: "Repository preview card",
  });
</script>

<script lang="ts">
  import { buttonVariants, PreviewCard } from "@coss-sv/ui";
  import { ArrowTurnBackwardIcon, StarIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<PreviewCard.Root>
  <PreviewCard.Trigger as="button" class={buttonVariants({ variant: "ghost" })}>
    coss.com/ui
  </PreviewCard.Trigger><PreviewCard.Popup>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h4 class="font-medium text-sm">coss.com/ui</h4>
        <p class="text-muted-foreground text-sm">
          Beautifully designed components that you can copy and paste into your
          apps.
        </p>
      </div>
      <div class="flex items-center gap-4 text-muted-foreground text-xs">
        <div class="flex items-center gap-1">
          <span aria-hidden="true" class="size-2 rounded-full bg-blue-500"
          ></span>
          <span>TypeScript</span>
        </div>
        <div class="flex items-center gap-1">
          <HugeiconsIcon
            aria-hidden="true"
            class="size-3"
            icon={StarIcon}
            strokeWidth={2}
          />
          <span>58.2k</span>
        </div>
        <div class="flex items-center gap-1">
          <HugeiconsIcon
            aria-hidden="true"
            class="size-3"
            icon={ArrowTurnBackwardIcon}
            strokeWidth={2}
          />
          <span>5.1k</span>
        </div>
      </div>
    </div>
  </PreviewCard.Popup>
</PreviewCard.Root>
