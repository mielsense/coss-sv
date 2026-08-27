<script lang="ts">
import { buttonVariants, PreviewCard } from "@coss-sv/ui";
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
            <span aria-hidden="true" class="size-2 rounded-full bg-blue-500"></span
            ><span>TypeScript</span>
          </div>
          <div class="flex items-center gap-1">{@render starIcon()}<span>58.2k</span></div>
          <div class="flex items-center gap-1">{@render cornerUpLeftIcon()}<span>5.1k</span></div>
        </div>
      </div>
    </PreviewCard.Popup>
  </PreviewCard.Root>
</section>

{#snippet starIcon()}
  <svg
    aria-hidden="true"
    class="size-3"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path
      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
    />
  </svg>
{/snippet}
{#snippet cornerUpLeftIcon()}
  <svg
    aria-hidden="true"
    class="size-3"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="m9 14-4-4 4-4" />
    <path d="M5 10h11a4 4 0 0 1 4 4v4" />
  </svg>
{/snippet}
