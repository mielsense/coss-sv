<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer", "menu"],
    id: "p-drawer-13",
    interactive: true,
    responsive: true,
    title: "Responsive action menu",
  });
</script>

<script lang="ts">
  import { buttonVariants, Drawer, drawerMenuItemVariants, Menu } from "@coss-sv/ui";
  import {
    CopyIcon,
    Delete02Icon,
    MoreHorizontalIcon,
    PencilIcon,
    Share08Icon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { MediaQuery } from "svelte/reactivity";

  const isMobile = new MediaQuery("(max-width: 799px)", false);
</script>

{#if isMobile.current}
  <Drawer.Root>
    <Drawer.Trigger
      aria-label="Open menu"
      class={buttonVariants({ size: "icon", variant: "outline" })}
    >
      <HugeiconsIcon aria-hidden="true" icon={MoreHorizontalIcon} strokeWidth={2} />
    </Drawer.Trigger>
    <Drawer.Popup showBar>
      <Drawer.Panel>
        <Drawer.Menu>
          <Drawer.MenuGroup>
            <Drawer.MenuGroupLabel>Actions</Drawer.MenuGroupLabel>
            <Drawer.Close class={drawerMenuItemVariants()}>
              <HugeiconsIcon aria-hidden="true" icon={PencilIcon} strokeWidth={2} />Edit
            </Drawer.Close>
            <Drawer.Close class={drawerMenuItemVariants()}>
              <HugeiconsIcon aria-hidden="true" icon={CopyIcon} strokeWidth={2} />Duplicate
            </Drawer.Close>
            <Drawer.Close class={drawerMenuItemVariants()}>
              <HugeiconsIcon aria-hidden="true" icon={Share08Icon} strokeWidth={2} />Share
            </Drawer.Close>
          </Drawer.MenuGroup>
          <Drawer.MenuSeparator />
          <Drawer.MenuCheckboxItem>Shuffle</Drawer.MenuCheckboxItem><Drawer.MenuCheckboxItem>
            Repeat
          </Drawer.MenuCheckboxItem><Drawer.MenuCheckboxItem disabled>
            Enhanced Audio
          </Drawer.MenuCheckboxItem>
          <Drawer.MenuSeparator />
          <Drawer.MenuGroup>
            <Drawer.MenuGroupLabel>Sort by</Drawer.MenuGroupLabel><Drawer.MenuRadioGroup
              defaultValue="artist"
            >
              <Drawer.MenuRadioItem value="artist">
                Artist
              </Drawer.MenuRadioItem><Drawer.MenuRadioItem value="album">
                Album
              </Drawer.MenuRadioItem><Drawer.MenuRadioItem value="title">
                Title
              </Drawer.MenuRadioItem>
            </Drawer.MenuRadioGroup>
          </Drawer.MenuGroup>
          <Drawer.MenuSeparator />
          <Drawer.MenuCheckboxItem variant="switch">Auto save</Drawer.MenuCheckboxItem>
          <Drawer.MenuSeparator />
          <Drawer.Root>
            <Drawer.MenuTrigger>Add to Playlist</Drawer.MenuTrigger><Drawer.Popup showBar>
              <Drawer.Panel>
                <Drawer.Menu>
                  <Drawer.MenuGroup>
                    <Drawer.MenuGroupLabel>Add to Playlist</Drawer.MenuGroupLabel>
                  </Drawer.MenuGroup><Drawer.Close class={drawerMenuItemVariants()}>
                    Jazz
                  </Drawer.Close><Drawer.Root>
                    <Drawer.MenuTrigger>Rock</Drawer.MenuTrigger><Drawer.Popup showBar>
                      <Drawer.Panel>
                        <Drawer.Menu>
                          <Drawer.MenuGroup>
                            <Drawer.MenuGroupLabel>Rock</Drawer.MenuGroupLabel>
                          </Drawer.MenuGroup><Drawer.Close class={drawerMenuItemVariants()}>
                            Hard Rock
                          </Drawer.Close><Drawer.Close class={drawerMenuItemVariants()}>
                            Soft Rock
                          </Drawer.Close><Drawer.Close class={drawerMenuItemVariants()}>
                            Classic Rock
                          </Drawer.Close><Drawer.MenuSeparator />
                          {#each ["Metal", "Punk", "Grunge", "Alternative", "Indie", "Electronic"] as item}
                            <Drawer.Close class={drawerMenuItemVariants()}>
                              {item}
                            </Drawer.Close>
                          {/each}
                        </Drawer.Menu>
                      </Drawer.Panel>
                    </Drawer.Popup>
                  </Drawer.Root><Drawer.Close class={drawerMenuItemVariants()}>Pop</Drawer.Close>
                </Drawer.Menu>
              </Drawer.Panel>
            </Drawer.Popup>
          </Drawer.Root>
          <Drawer.MenuSeparator />
          <Drawer.MenuGroup>
            <Drawer.MenuGroupLabel>Danger zone</Drawer.MenuGroupLabel><Drawer.Close
              class={drawerMenuItemVariants({ variant: "destructive" })}
            >
              <HugeiconsIcon aria-hidden="true" icon={Delete02Icon} strokeWidth={2} />Delete
            </Drawer.Close>
          </Drawer.MenuGroup>
        </Drawer.Menu>
      </Drawer.Panel>
    </Drawer.Popup>
  </Drawer.Root>
{:else}
  <Menu.Root>
    <Menu.Trigger
      aria-label="Open menu"
      class={buttonVariants({ size: "icon", variant: "outline" })}
    >
      <HugeiconsIcon aria-hidden="true" icon={MoreHorizontalIcon} strokeWidth={2} />
    </Menu.Trigger>
    <Menu.Popup>
      <Menu.Group>
        <Menu.GroupLabel>Actions</Menu.GroupLabel><Menu.Item>
          <HugeiconsIcon aria-hidden="true" icon={PencilIcon} strokeWidth={2} />Edit
        </Menu.Item><Menu.Item>
          <HugeiconsIcon aria-hidden="true" icon={CopyIcon} strokeWidth={2} />Duplicate
        </Menu.Item><Menu.Item>
          <HugeiconsIcon aria-hidden="true" icon={Share08Icon} strokeWidth={2} />Share
        </Menu.Item>
      </Menu.Group>
      <Menu.Separator /><Menu.CheckboxItem>Shuffle</Menu.CheckboxItem><Menu.CheckboxItem>
        Repeat
      </Menu.CheckboxItem><Menu.CheckboxItem disabled>
        Enhanced Audio
      </Menu.CheckboxItem><Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Sort by</Menu.GroupLabel><Menu.RadioGroup defaultValue="artist">
          <Menu.RadioItem value="artist">Artist</Menu.RadioItem><Menu.RadioItem value="album">
            Album
          </Menu.RadioItem><Menu.RadioItem value="title">Title</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Group>
      <Menu.Separator /><Menu.CheckboxItem variant="switch">Auto save</Menu.CheckboxItem>
      <Menu.Separator />
      <Menu.Sub>
        <Menu.SubTrigger>Add to Playlist</Menu.SubTrigger><Menu.SubPopup>
          <Menu.Item>Jazz</Menu.Item><Menu.Sub>
            <Menu.SubTrigger>Rock</Menu.SubTrigger><Menu.SubPopup>
              <Menu.Item>Hard Rock</Menu.Item><Menu.Item>Soft Rock</Menu.Item><Menu.Item
                >Classic Rock</Menu.Item
              >
              <Menu.Separator />
              {#each ["Metal", "Punk", "Grunge", "Alternative", "Indie", "Electronic"] as item}
                <Menu.Item>{item}</Menu.Item>
              {/each}
            </Menu.SubPopup>
          </Menu.Sub><Menu.Item>Pop</Menu.Item>
        </Menu.SubPopup>
      </Menu.Sub>
      <Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Danger zone</Menu.GroupLabel><Menu.Item variant="destructive">
          <HugeiconsIcon aria-hidden="true" icon={Delete02Icon} strokeWidth={2} />Delete
        </Menu.Item>
      </Menu.Group>
    </Menu.Popup>
  </Menu.Root>
{/if}
