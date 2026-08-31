<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["avatar", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-19",
    interactive: true,
    responsive: false,
    title: "Select with avatars",
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
  <Select.Trigger>
    <Select.Value>
      {#snippet children(item: User | null)}{#if item}<span class="flex items-center gap-2">
            <Avatar.Root class="size-5">
              <Avatar.Image alt={item.label} src={item.avatar} /><Avatar.Fallback
                class="text-[.625rem]"
              >
                {item.initials}
              </Avatar.Fallback>
            </Avatar.Root>
            <span class="truncate">{item.label}</span>
          </span>{/if}{/snippet}
    </Select.Value>
  </Select.Trigger><Select.Popup>
    <Select.Group>
      <Select.GroupLabel>
        Impersonate user
      </Select.GroupLabel>{#each users as item (item.value)}<Select.Item value={item}>
          <span class="flex items-center gap-2">
            <Avatar.Root class="size-5">
              <Avatar.Image alt={item.label} src={item.avatar} /><Avatar.Fallback
                class="text-[10px]"
              >
                {item.initials}
              </Avatar.Fallback>
            </Avatar.Root>
            <span class="truncate">{item.label}</span>
          </span>
        </Select.Item>{/each}
    </Select.Group>
  </Select.Popup>
</Select.Root>
