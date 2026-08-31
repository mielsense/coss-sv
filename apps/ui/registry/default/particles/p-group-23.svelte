<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["avatar", "badge", "button", "combobox", "group"],
    id: "p-group-23",
    interactive: true,
    responsive: true,
    title: "Group with filter label, combobox multi-select, and remove button",
  });
</script>

<script lang="ts">
  import {
    Avatar,
    Badge,
    Button,
    buttonVariants,
    Combobox,
    Group,
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import FilterIcon from "@hugeicons/core-free-icons/FilterIcon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
  import UnfoldMoreIcon from "@hugeicons/core-free-icons/UnfoldMoreIcon";

  type FilterOption = { id: string; label: string; avatar?: string };
  const members: FilterOption[] = [
    {
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
      id: "alex-chen",
      label: "Alex Chen",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
      id: "sarah-johnson",
      label: "Sarah Johnson",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
      id: "marcus-williams",
      label: "Marcus Williams",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces",
      id: "emma-davis",
      label: "Emma Davis",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces",
      id: "james-miller",
      label: "James Miller",
    },
  ];
  let selectedMembers = $state<FilterOption[]>(members.slice(0, 2));
  const firstMember = $derived(selectedMembers[0]);
  const remainingCount = $derived(selectedMembers.length - 1);
  function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
  }
</script>

{#snippet memberAvatar(member: FilterOption)}
  <Avatar.Root class="size-5">
    {#if member.avatar}
      <Avatar.Image alt={member.label} src={member.avatar} />
    {/if}
    <Avatar.Fallback class="text-[0.5rem]">{initials(member.label)}</Avatar.Fallback>
  </Avatar.Root>
{/snippet}

<Group.Root>
  <Group.Text
    class={buttonVariants({ size: "sm", variant: "outline", class: "pointer-events-none" })}
  >
    <HugeiconsIcon aria-hidden="true" icon={FilterIcon} strokeWidth={2} />
    Member
  </Group.Text>
  <Group.Separator />
  <Combobox.Root
    autoHighlight
    bind:value={selectedMembers}
    items={members}
    itemToStringLabel={(item) => item.label}
    itemToStringValue={(item) => item.id}
    multiple
  >
    <Combobox.Trigger
      class={buttonVariants({
        size: "sm",
        variant: "outline",
        class: selectedMembers.length === 0 ? "justify-between" : undefined,
      })}
    >
      {#if firstMember}
        <div class="flex items-center gap-2">
          {@render memberAvatar(firstMember)}
          <span class="truncate">{firstMember.label}</span>
          {#if remainingCount > 0}
            <Badge class="tabular-nums" variant="secondary">+{remainingCount}</Badge>
          {/if}
        </div>
      {:else}
        Select
        <HugeiconsIcon aria-hidden="true" class="-me-1!" icon={UnfoldMoreIcon} strokeWidth={2} />
      {/if}
    </Combobox.Trigger>
    <Combobox.Popup aria-label="Select member">
      <div class="border-b p-2">
        <Combobox.Input
          class="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
          placeholder="Search members..."
          showTrigger={false}
        >
          {#snippet startAddon()}
            <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
          {/snippet}
        </Combobox.Input>
      </div>
      <Combobox.Empty>No members found.</Combobox.Empty>
      <Combobox.List>
        <Combobox.Collection>
          {#snippet children(option: FilterOption)}
            <Combobox.Item value={option}>
              <div class="flex items-center gap-2">
                {@render memberAvatar(option)}
                <span>{option.label}</span>
              </div>
            </Combobox.Item>
          {/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
  <Group.Separator />
  <Button
    aria-label="Remove filter"
    onclick={() => (selectedMembers = [])}
    size="icon-sm"
    variant="outline"
  >
    <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
  </Button>
</Group.Root>
