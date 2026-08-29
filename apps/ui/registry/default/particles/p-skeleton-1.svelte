<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar", "button", "skeleton"],
    containerClass:
      "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
    id: "p-skeleton-1",
    interactive: true,
    responsive: true,
    title: "Basic skeleton",
  });
</script>

<script lang="ts">
  import { Avatar, Button, Skeleton, HugeiconsIcon } from "@coss-sv/ui";
  import { UserRoundPlusIcon, UsersRoundIcon } from "@hugeicons/core-free-icons";

  const users = [
    {
      delay: 3000,
      fallback: "SJ",
      followers: "15k",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&dpr=2&q=80",
      name: "Sarah Johnson",
      role: "Design Engineer",
    },
    {
      delay: 4000,
      fallback: "MA",
      followers: "8k",
      image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=80&h=80&dpr=2&q=80",
      name: "Mark Bennett Andersson",
      role: "Product Designer",
    },
    {
      delay: 3400,
      fallback: "AR",
      followers: "12k",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&dpr=2&q=80",
      name: "Alex Rivera",
      role: "UI/UX Designer",
    },
  ] as const;

  let loaded = $state(new Set<string>());

  $effect(() => {
    let timers: number[] = [];
    const frame = window.requestAnimationFrame(() => {
      timers = users.map((user) =>
        window.setTimeout(() => {
          loaded = new Set([...loaded, user.fallback]);
        }, user.delay),
      );
    });
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
    };
  });
</script>

<div class="flex w-full max-w-92 flex-col gap-6">
  {#each users as user (user.fallback)}
    <div class="flex items-center gap-4">
      {#if loaded.has(user.fallback)}
        <Avatar.Root class="size-10">
          <Avatar.Image alt={user.name} src={user.image} />
          <Avatar.Fallback>{user.fallback}</Avatar.Fallback>
        </Avatar.Root>
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <h4 class="line-clamp-1 font-medium text-sm">{user.name}</h4>
          <div class="flex items-center gap-3 text-muted-foreground text-xs">
            <span class="truncate">{user.role}</span>
            <div class="flex min-w-0 items-center gap-1">
              <HugeiconsIcon
                aria-hidden="true"
                class="size-3 shrink-0"
                icon={UsersRoundIcon}
                strokeWidth={2}
              />
              <span class="truncate">
                {user.followers}<span class="max-sm:hidden"> followers</span>
              </span>
            </div>
          </div>
        </div>
        <Button size="xs">
          <HugeiconsIcon aria-hidden="true" icon={UserRoundPlusIcon} strokeWidth={2} />
          Follow
        </Button>
      {:else}
        <Skeleton class="size-10 rounded-full" />
        <div class="flex flex-1 flex-col">
          <Skeleton class="my-0.5 h-4 max-w-54" />
          <div class="flex max-w-54 items-center gap-1">
            <Skeleton class="my-0.5 h-4 w-1/2" />
            <Skeleton class="my-0.5 h-4 w-1/2" />
          </div>
        </div>
        <Skeleton class="h-7 w-19 sm:h-6 sm:w-17" />
      {/if}
    </div>
  {/each}
</div>
