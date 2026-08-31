<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-1",
    interactive: true,
    responsive: false,
    title: "Basic menu",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, Menu } from "@coss-sv/ui";
  import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
  import NextIcon from "@hugeicons/core-free-icons/NextIcon";
  import PauseIcon from "@hugeicons/core-free-icons/PauseIcon";
  import PlayIcon from "@hugeicons/core-free-icons/PlayIcon";
  import PreviousIcon from "@hugeicons/core-free-icons/PreviousIcon";
</script>

<Menu.Root>
  <Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup>
    <Menu.Group>
      <Menu.GroupLabel>Playback</Menu.GroupLabel>
      <Menu.Item>
        <HugeiconsIcon aria-hidden="true" icon={PlayIcon} strokeWidth={2} />Play<Menu.Shortcut>
          ⌘P
        </Menu.Shortcut>
      </Menu.Item>
      <Menu.Item disabled>
        <HugeiconsIcon aria-hidden="true" icon={PauseIcon} strokeWidth={2} />Pause<Menu.Shortcut>
          ⇧⌘P
        </Menu.Shortcut>
      </Menu.Item>
      <Menu.Item>
        <HugeiconsIcon
          aria-hidden="true"
          icon={PreviousIcon}
          strokeWidth={2}
        />Previous<Menu.Shortcut>⌘[</Menu.Shortcut>
      </Menu.Item>
      <Menu.Item>
        <HugeiconsIcon aria-hidden="true" icon={NextIcon} strokeWidth={2} />Next<Menu.Shortcut>
          ⌘]
        </Menu.Shortcut>
      </Menu.Item>
    </Menu.Group>
    <Menu.Separator /><Menu.CheckboxItem>Shuffle</Menu.CheckboxItem><Menu.CheckboxItem>
      Repeat
    </Menu.CheckboxItem><Menu.CheckboxItem disabled>Enhanced Audio</Menu.CheckboxItem>
    <Menu.Separator /><Menu.Group>
      <Menu.GroupLabel>Sort by</Menu.GroupLabel><Menu.RadioGroup>
        <Menu.RadioItem value="artist">Artist</Menu.RadioItem><Menu.RadioItem value="album">
          Album
        </Menu.RadioItem><Menu.RadioItem value="title">Title</Menu.RadioItem>
      </Menu.RadioGroup>
    </Menu.Group>
    <Menu.Separator /><Menu.CheckboxItem variant="switch">
      Auto save
    </Menu.CheckboxItem><Menu.Separator />
    <Menu.Sub>
      <Menu.SubTrigger>Add to Playlist</Menu.SubTrigger><Menu.SubPopup>
        <Menu.Item>Jazz</Menu.Item><Menu.Sub>
          <Menu.SubTrigger>Rock</Menu.SubTrigger><Menu.SubPopup>
            {#each ["Hard Rock", "Soft Rock", "Classic Rock"] as item (item)}<Menu.Item>
                {item}
              </Menu.Item>{/each}<Menu.Separator
            />{#each ["Metal", "Punk", "Grunge", "Alternative", "Indie", "Electronic"] as item (item)}<Menu.Item
              >
                {item}
              </Menu.Item>{/each}
          </Menu.SubPopup>
        </Menu.Sub><Menu.Item>Pop</Menu.Item>
      </Menu.SubPopup>
    </Menu.Sub>
    <Menu.Separator /><Menu.Item variant="destructive">
      <HugeiconsIcon aria-hidden="true" icon={Delete02Icon} strokeWidth={2} />Delete<Menu.Shortcut>
        ⌘⌫
      </Menu.Shortcut>
    </Menu.Item>
  </Menu.Popup>
</Menu.Root>
