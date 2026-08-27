<script lang="ts">
import {
  Avatar,
  Badge,
  Button,
  buttonVariants,
  CheckboxGroup,
  Form,
  Group,
  Label,
  Popover,
  Textarea,
} from "@coss-sv/ui";

const animated = Popover.PopoverCreateHandle<"notifications" | "profile">();
const occurrences = [
  { date: "Wed, Jul 15", id: "occurrence-1", time: "9:00 – 9:30am" },
  { date: "Wed, Jul 15", id: "occurrence-2", time: "10:00 – 10:30am" },
  { date: "Wed, Jul 15", id: "occurrence-3", time: "11:00 – 11:30am" },
];
let selected = $state(occurrences.map((item) => item.id));
</script>

<div class="fixture">
  <section data-particle="p-popover-1">
    <Popover.Root>
      <Popover.Trigger class={buttonVariants({ variant: "outline" })}>Open Popover</Popover.Trigger>
      <Popover.Popup class="w-80">
        <div class="mb-4">
          <Popover.Title class="text-base">Send us feedback</Popover.Title>
          <Popover.Description>Let us know how we can improve.</Popover.Description>
        </div>
        <Form class="flex w-full flex-col gap-4">
          <Textarea aria-label="Send feedback" id="feedback" placeholder="How can we improve?" />
          <Button type="submit">Send feedback</Button>
        </Form>
      </Popover.Popup>
    </Popover.Root>
  </section>

  <section data-particle="p-popover-2">
    <Popover.Root>
      <Popover.Trigger class={buttonVariants({ variant: "outline" })}>Open Popover</Popover.Trigger>
      <Popover.Popup class="w-80">
        <Popover.Close
          aria-label="Close"
          class={buttonVariants({ class: "absolute end-2 top-2", size: "icon", variant: "ghost" })}
          >{@render xIcon()}</Popover.Close
        >
        <div class="mb-2">
          <Popover.Title class="text-base">Notifications</Popover.Title>
          <Popover.Description>You are all caught up. Good job!</Popover.Description>
        </div>
        <Popover.Close class={buttonVariants({ variant: "outline" })}>Close</Popover.Close>
      </Popover.Popup>
    </Popover.Root>
  </section>

  <section class="flex gap-2" data-particle="p-popover-3">
    <Popover.Trigger
      aria-label="Notifications"
      class={buttonVariants({ size: "icon", variant: "outline" })}
      handle={animated}
      payload="notifications"
      >{@render bellIcon()}</Popover.Trigger
    >
    <Popover.Trigger
      aria-label="Profile"
      class={buttonVariants({ size: "icon", variant: "outline" })}
      handle={animated}
      payload="profile"
      >{@render userIcon()}</Popover.Trigger
    >
    <Popover.Root handle={animated}>
      {#snippet children({ payload }: { payload: "notifications" | "profile" | undefined })}
        <Popover.Popup class="min-w-none">
          {#if payload === "profile"}
            <div class="w-48">
              <div class="flex items-center gap-3">
                <Avatar.Root>
                  <Avatar.Image
                    alt="Mark Andersson"
                    src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
                  />
                  <Avatar.Fallback>MA</Avatar.Fallback>
                </Avatar.Root>
                <div class="min-w-0 flex-1">
                  <h4 class="line-clamp-1 font-medium text-sm">Mark Andersson</h4>
                  <div class="text-muted-foreground text-xs">Product Designer</div>
                </div>
              </div>
              <Button class="mt-3 w-full" size="sm" variant="outline">Log out</Button>
            </div>
          {:else}
            <Popover.Title class="text-base">Notifications</Popover.Title>
            <Popover.Description>You have no new notifications at this time.</Popover.Description>
          {/if}
        </Popover.Popup>
      {/snippet}
    </Popover.Root>
  </section>

  <section class="flex gap-2" data-particle="p-popover-4">
    <Button size="xs" variant="outline">Reject</Button>
    <Group.Root aria-label="Confirm booking">
      <Button size="xs">Confirm all</Button><Group.Separator class="bg-primary/72" />
      <Popover.Root>
        <Popover.Trigger
          aria-label="Choose occurrences to confirm"
          class={buttonVariants({ size: "icon-xs" })}
          >{@render chevronDownIcon()}</Popover.Trigger
        >
        <Popover.Popup align="end" class="w-84">
          <div class="mb-3">
            <Popover.Title class="text-sm">Confirm occurrences</Popover.Title
            ><Popover.Description class="text-xs"
              >{occurrences.length}
              pending for this booking</Popover.Description
            >
          </div>
          <CheckboxGroup.Root
            aria-label="Occurrences to confirm"
            class="gap-0 self-stretch"
            bind:value={selected}
          >
            {#each occurrences as occurrence (occurrence.id)}
              <Label class="flex w-full gap-2 py-1.5"
                ><CheckboxGroup.Item value={occurrence.id} />
                <span class="tabular-nums">{occurrence.time}</span
                ><span class="ms-auto font-normal text-muted-foreground"
                  >{occurrence.date}</span
                ></Label
              >
            {/each}
          </CheckboxGroup.Root>
          <div class="mt-3 flex justify-end gap-2">
            <Popover.Close
              class={buttonVariants({ size: "xs", variant: "ghost" })}
              disabled={selected.length === 0}
              >Reject selected</Popover.Close
            >
            <Popover.Close class={buttonVariants({ size: "xs" })} disabled={selected.length === 0}
              >Confirm selected
              <Badge class="-me-1 text-primary-foreground/60"
                >{selected.length}</Badge
              ></Popover.Close
            >
          </div>
        </Popover.Popup>
      </Popover.Root>
    </Group.Root>
  </section>
</div>

{#snippet icon(paths: import("svelte").Snippet)}
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    {@render paths()}
  </svg>
{/snippet}
{#snippet xIcon()}
  {@render icon(xPaths)}
{/snippet}
{#snippet xPaths()}
  <path d="M18 6 6 18" />
  <path d="m6 6 12 12" />
{/snippet}
{#snippet bellIcon()}
  {@render icon(bellPaths)}
{/snippet}
{#snippet bellPaths()}
  <path d="M10.268 21a2 2 0 0 0 3.464 0" />
  <path
    d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
  />
{/snippet}
{#snippet userIcon()}
  {@render icon(userPaths)}
{/snippet}
{#snippet userPaths()}
  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
  <circle cx="12" cy="7" r="4" />
{/snippet}
{#snippet chevronDownIcon()}
  {@render icon(chevronDownPaths)}
{/snippet}
{#snippet chevronDownPaths()}
  <path d="m6 9 6 6 6-6" />
{/snippet}

<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: 3rem;
  padding: 2rem;
}
.fixture > section {
  display: flex;
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}
</style>
