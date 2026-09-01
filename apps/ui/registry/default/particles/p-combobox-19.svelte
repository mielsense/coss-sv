<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["avatar", "badge", "button", "combobox"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
    id: "p-combobox-19",
    interactive: true,
    responsive: false,
    title: "Combobox multiple with stacked chips",
  });
</script>

<script lang="ts">
  import { Avatar, Badge, Button, Combobox, HugeiconsIcon } from "@coss-sv/ui";
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

  type TeamMember = {
    avatar: string;
    initials: string;
    label: string;
    priority: "Lowest" | "Low" | "Medium" | "High" | "Highest";
    value: string;
    weight: number;
  };
  const teamMembers: TeamMember[] = [
    {
      avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80",
      initials: "JH",
      label: "Jenny Hamilton",
      priority: "Highest",
      value: "jenny",
      weight: 200,
    },
    {
      avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=72&h=72&dpr=2&q=80",
      initials: "PS",
      label: "Paul Smith",
      priority: "Medium",
      value: "paul",
      weight: 100,
    },
    {
      avatar: "https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=72&h=72&dpr=2&q=80",
      initials: "LW",
      label: "Luna Wyen",
      priority: "High",
      value: "luna",
      weight: 150,
    },
    {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&dpr=2&q=80",
      initials: "AC",
      label: "Alex Chen",
      priority: "Low",
      value: "alex",
      weight: 100,
    },
    {
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&dpr=2&q=80",
      initials: "SJ",
      label: "Sarah Johnson",
      priority: "Medium",
      value: "sarah",
      weight: 50,
    },
    {
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=72&h=72&dpr=2&q=80",
      initials: "ED",
      label: "Emma Davis",
      priority: "Lowest",
      value: "emma",
      weight: 100,
    },
  ];
  let comboboxOpen = $state(false);
  let selected = $state.raw<TeamMember[]>(teamMembers.slice(0, 2));
  function remove(value: string): void {
    selected = selected.filter((item) => item.value !== value);
  }
</script>

<div class="flex w-full flex-col gap-2">
  <Combobox.Root
    autoHighlight
    items={teamMembers}
    multiple
    bind:open={comboboxOpen}
    bind:value={selected}
    onValueChange={(value) => {
      selected = value;
      comboboxOpen = false;
    }}
  >
    <Combobox.Input aria-label="Add team members" placeholder="Add team members…">
      {#snippet startAddon()}<HugeiconsIcon
          aria-hidden="true"
          icon={Search01Icon}
          strokeWidth={2}
        />{/snippet}
    </Combobox.Input>
    <Combobox.Popup>
      <Combobox.Empty>No team members found.</Combobox.Empty><Combobox.List>
        <Combobox.Collection>
          {#snippet children(item: TeamMember)}<Combobox.Item value={item}>
              {item.label}
            </Combobox.Item>{/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
  {#if selected.length}
    <ul class="flex flex-col gap-2">
      {#each selected as member (member.value)}
        <li
          class="flex items-center gap-2 rounded-lg border border-input p-1 ps-2 text-base sm:text-sm"
        >
          <Avatar.Root class="size-5">
            <Avatar.Image alt={member.label} src={member.avatar} /><Avatar.Fallback
              class="text-[.625rem]"
            >
              {member.initials}
            </Avatar.Fallback>
          </Avatar.Root>
          <span class="truncate font-medium">{member.label}</span>
          <Badge class="ms-auto" size="default" variant="outline">{member.priority}</Badge>
          <span class="text-muted-foreground tabular-nums">{member.weight}%</span>
          <Button
            aria-label={`Remove ${member.label}`}
            onclick={() => remove(member.value)}
            size="icon-xs"
            variant="ghost"
          >
            <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
