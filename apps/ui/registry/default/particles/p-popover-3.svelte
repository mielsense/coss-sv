<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["avatar", "button", "popover"],
  id: "p-popover-3",
  interactive: true,
  responsive: true,
  title: "Detached popover handle",
});
</script>
<script lang="ts">
import { Notification01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Avatar, Button, Popover, buttonVariants } from "@coss-sv/ui";
import type { Snippet } from "svelte";
const popoverHandle = Popover.PopoverCreateHandle<Snippet>();
</script>
{#snippet notificationsContent()}
  <Popover.Title class="text-base">Notifications</Popover.Title
  ><Popover.Description>You have no new notifications at this time.</Popover.Description>
{/snippet}
{#snippet profileContent()}
  <div class="w-48">
    <div class="flex items-center gap-3">
      <Avatar.Root
        ><Avatar.Image
          alt="Mark Andersson"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        /><Avatar.Fallback>MA</Avatar.Fallback></Avatar.Root
      >
      <div class="min-w-0 flex-1">
        <h4 class="line-clamp-1 font-medium text-sm">Mark Andersson</h4>
        <div class="flex items-center gap-3 text-muted-foreground text-xs">Product Designer</div>
      </div>
    </div>
    <Button class="mt-3 w-full" size="sm" variant="outline">Log out</Button>
  </div>
{/snippet}
<div class="flex gap-2">
  <Popover.Trigger
    aria-label="Notifications"
    class={buttonVariants({ size: "icon", variant: "outline" })}
    handle={popoverHandle}
    payload={notificationsContent}
    ><HugeiconsIcon aria-hidden="true" icon={Notification01Icon} strokeWidth={2} /></Popover.Trigger
  >
  <Popover.Trigger
    aria-label="Profile"
    class={buttonVariants({ size: "icon", variant: "outline" })}
    handle={popoverHandle}
    payload={profileContent}
    ><HugeiconsIcon aria-hidden="true" icon={UserIcon} strokeWidth={2} /></Popover.Trigger
  >
  <Popover.Root handle={popoverHandle}
    >{#snippet children({ payload })}
      <Popover.Popup class="min-w-none"
        >{#if payload}
          {@render payload()}
        {/if}</Popover.Popup
      >
    {/snippet}</Popover.Root
  >
</div>
