<script lang="ts">
  import { buttonVariants, PreviewCard } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";
</script>

<section class="flex min-h-80 items-center justify-center p-8" data-particle="p-preview-card-1">
  <PreviewCard.Root>
    <PreviewCard.Trigger as="button" class={buttonVariants({ variant: "ghost" })}
      >coss.com/ui</PreviewCard.Trigger
    >
    <PreviewCard.Popup>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h4 class="font-medium text-sm">coss.com/ui</h4>
          <p class="text-muted-foreground text-sm">
            Beautifully designed components that you can copy and paste into your apps.
          </p>
        </div>
        <div class="flex items-center gap-4 text-muted-foreground text-xs">
          <div class="flex items-center gap-1">
            <span aria-hidden="true" class="size-2 rounded-full bg-blue-500"></span><span
              >TypeScript</span
            >
          </div>
          <div class="flex items-center gap-1">{@render starIcon()}<span>58.2k</span></div>
          <div class="flex items-center gap-1">{@render cornerUpLeftIcon()}<span>5.1k</span></div>
        </div>
      </div>
    </PreviewCard.Popup>
  </PreviewCard.Root>
</section>

{#snippet starIcon()}
  <FixtureIcon aria-hidden="true" class="size-3" name="star" />
{/snippet}
{#snippet cornerUpLeftIcon()}
  <FixtureIcon aria-hidden="true" class="size-3" name="redo" />
{/snippet}
