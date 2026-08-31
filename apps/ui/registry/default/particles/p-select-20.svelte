<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["avatar", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-20",
    interactive: true,
    responsive: false,
    title: "Rich select with avatars and usernames",
  });
</script>

<script lang="ts">
  import { Avatar, Select } from "@coss-sv/ui";

  const users = [
    {
      avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80",
      initials: "JH",
      label: "Jenny Hamilton",
      username: "@jennycodes",
      value: "jenny",
    },
    {
      avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=72&h=72&dpr=2&q=80",
      initials: "PS",
      label: "Paul Smith",
      username: "@paulsmith",
      value: "paul",
    },
    {
      avatar: "https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=72&h=72&dpr=2&q=80",
      initials: "LW",
      label: "Luna Wyen",
      username: "@wyen.luna",
      value: "luna",
    },
  ];
  type User = (typeof users)[number];
</script>

<Select.Root
  aria-label="Select user"
  value={users[0]}
  itemToStringValue={(item: User) => item.value}
>
  <Select.Trigger class="h-auto py-1.5">
    <Select.Value>
      {#snippet children(item: User | null)}{#if item}<span class="flex items-center gap-2">
            <Avatar.Root class="size-8">
              <Avatar.Image alt={item.label} src={item.avatar} /><Avatar.Fallback>
                {item.initials}
              </Avatar.Fallback>
            </Avatar.Root>
            <span class="flex flex-col text-left">
              <span class="truncate font-medium">{item.label}</span>
              <span class="truncate text-muted-foreground text-xs">{item.username}</span>
            </span>
          </span>{/if}{/snippet}
    </Select.Value>
  </Select.Trigger><Select.Popup>
    {#each users as item (item.value)}<Select.Item class="py-1.5" value={item}>
        <span class="flex items-center gap-2">
          <Avatar.Root class="size-8">
            <Avatar.Image alt={item.label} src={item.avatar} /><Avatar.Fallback>
              {item.initials}
            </Avatar.Fallback>
          </Avatar.Root>
          <span class="flex flex-col">
            <span class="truncate font-medium">{item.label}</span>
            <span class="truncate text-muted-foreground text-xs">{item.username}</span>
          </span>
        </span>
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
