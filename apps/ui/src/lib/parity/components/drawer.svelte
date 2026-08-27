<!-- biome-ignore-all lint/a11y/useValidAnchor: The COSS particles intentionally use hash-only placeholder links. -->
<script lang="ts">
import { Button, Dialog, Drawer, Field, Form, Input, Menu, buttonVariants } from "@coss-sv/ui";
import { MediaQuery } from "svelte/reactivity";
const positions = ["right", "left", "top", "bottom"] as const;
const boxes = Array.from({ length: 48 }, (_, index) => index);
const isMobile = new MediaQuery("(max-width: 768px)", false);
let snapPoint = $state<string | number | null>("300px");
</script>

<div class="fixture">
  {#each [true, false] as showBar, index}
    <section data-particle={`p-drawer-${index + 1}`}>
      <Drawer.Root
        ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open drawer</Drawer.Trigger
        ><Drawer.Popup {showBar}
          ><Drawer.Header class="text-center"
            ><Drawer.Title>Notifications</Drawer.Title
            ><Drawer.Description
              >This is the description of the drawer.</Drawer.Description
            ></Drawer.Header
          ><Drawer.Footer class="justify-center sm:justify-center" variant="bare"
            ><Drawer.Close class={buttonVariants({ variant: "outline" })}
              >Close</Drawer.Close
            ></Drawer.Footer
          ></Drawer.Popup
        ></Drawer.Root
      >
    </section>
  {/each}

  <section data-particle="p-drawer-3">
    <Drawer.Root position="right"
      ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open drawer</Drawer.Trigger
      ><Drawer.Popup showCloseButton variant="straight"
        ><Drawer.Header
          ><Drawer.Title>Notifications</Drawer.Title
          ><Drawer.Description
            >This is the description of the drawer.</Drawer.Description
          ></Drawer.Header
        ><Drawer.Panel
          ><p class="text-muted-foreground text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p></Drawer.Panel
        ></Drawer.Popup
      ></Drawer.Root
    >
  </section>

  {#each ["inset", "straight"] as variant, offset}
    <section data-particle={`p-drawer-${offset + 4}`}>
      <div class="flex flex-wrap gap-2">
        {#each positions as position}
          <Drawer.Root {position}
            ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
              >{position[0]?.toUpperCase()}{position.slice(1)}</Drawer.Trigger
            ><Drawer.Popup variant={variant as "inset" | "straight"}
              ><Drawer.Header
                ><Drawer.Title
                  >{position[0]?.toUpperCase()}{position.slice(1)}</Drawer.Title
                ></Drawer.Header
              ><Drawer.Panel
                ><p class="text-muted-foreground text-sm">
                  Content from the {position}.
                </p></Drawer.Panel
              ></Drawer.Popup
            ></Drawer.Root
          >
        {/each}
      </div>
    </section>
  {/each}

  <section data-particle="p-drawer-6">
    <Drawer.Root
      ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
        >Scrollable content</Drawer.Trigger
      ><Drawer.Popup showBar
        ><Drawer.Header><Drawer.Title>Scrollable content</Drawer.Title></Drawer.Header
        ><Drawer.Panel
          ><div class="flex flex-col gap-2">
            {#each boxes as _box}
              <div class="h-12 shrink-0 rounded-xl border bg-muted"></div>
            {/each}
          </div></Drawer.Panel
        ><Drawer.Footer
          ><Drawer.Close class={buttonVariants({ variant: "outline" })}
            >Close</Drawer.Close
          ></Drawer.Footer
        ></Drawer.Popup
      ></Drawer.Root
    >
  </section>

  <section data-particle="p-drawer-7">
    <Drawer.Root
      ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Nested drawers</Drawer.Trigger
      ><Drawer.Popup showBar
        ><Drawer.Header class="text-center"
          ><Drawer.Title>First step</Drawer.Title
          ><Drawer.Description
            >This is the first step. Tap the button below to continue to the next
            screen.</Drawer.Description
          ></Drawer.Header
        ><Drawer.Footer class="justify-center sm:justify-center" variant="bare"
          ><Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close
          ><Drawer.Root
            ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Continue</Drawer.Trigger
            ><Drawer.Popup showBar
              ><Drawer.Header class="text-center"
                ><Drawer.Title>Second step</Drawer.Title
                ><Drawer.Description
                  >You've reached the second step. Tap the button below to continue to the next
                  screen.</Drawer.Description
                ></Drawer.Header
              ><Drawer.Panel
                ><div class="flex justify-center">
                  <div class="size-48 shrink-0 rounded-xl border bg-muted"></div>
                </div></Drawer.Panel
              ><Drawer.Footer class="justify-center sm:justify-center" variant="bare"
                ><Drawer.Close class={buttonVariants({ variant: "ghost" })}>Back</Drawer.Close
                ><Drawer.Root
                  ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
                    >Continue</Drawer.Trigger
                  ><Drawer.Popup showBar
                    ><Drawer.Header class="text-center"
                      ><Drawer.Title>Third step</Drawer.Title
                      ><Drawer.Description
                        >You've reached the final step. You can close this drawer or go
                        back.</Drawer.Description
                      ></Drawer.Header
                    ><Drawer.Panel
                      ><div class="flex justify-center">
                        <div class="size-32 shrink-0 rounded-full border bg-muted"></div>
                      </div></Drawer.Panel
                    ></Drawer.Popup
                  ></Drawer.Root
                ></Drawer.Footer
              ></Drawer.Popup
            ></Drawer.Root
          ></Drawer.Footer
        ></Drawer.Popup
      ></Drawer.Root
    >
  </section>

  <section data-particle="p-drawer-8">
    <Drawer.Root position="right"
      ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
        >Nested inset drawers</Drawer.Trigger
      ><Drawer.Popup variant="inset"
        ><Drawer.Header
          ><Drawer.Title>Manage team member</Drawer.Title
          ><Drawer.Description
            >View and manage a user in your team.</Drawer.Description
          ></Drawer.Header
        ><Drawer.Panel class="grid gap-4"
          ><div class="grid gap-1">
            <p class="text-muted-foreground text-sm">Name</p>
            <p class="font-medium text-sm">Bora Baloglu</p>
          </div>
          <div class="grid gap-1">
            <p class="text-muted-foreground text-sm">Email</p>
            <p class="font-medium text-sm">bora@example.com</p>
          </div></Drawer.Panel
        ><Drawer.Footer
          ><Drawer.Root position="right"
            ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
              >Edit details</Drawer.Trigger
            ><Drawer.Popup variant="inset"
              >{const nestedMember = $state({ email: "bora@example.com", name: "Bora Baloglu" })}
              <Drawer.Header
                ><Drawer.Title>Edit details</Drawer.Title
                ><Drawer.Description
                  >Make changes to the member's information.</Drawer.Description
                ></Drawer.Header
              ><Drawer.Panel class="grid gap-4"
                ><Field.Root
                  ><Field.Label>Name</Field.Label>
                  <Input bind:value={nestedMember.name} type="text" /></Field.Root
                ><Field.Root
                  ><Field.Label>Email</Field.Label>
                  <Input bind:value={nestedMember.email} type="email" /></Field.Root
                ></Drawer.Panel
              ><Drawer.Footer
                ><Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close
                ><Button type="submit">Save changes</Button></Drawer.Footer
              ></Drawer.Popup
            ></Drawer.Root
          ></Drawer.Footer
        ></Drawer.Popup
      ></Drawer.Root
    >
  </section>

  <section data-particle="p-drawer-9">
    <Drawer.Root bind:snapPoint position="bottom" snapPoints={["300px", 1]} snapToSequentialPoints
      ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
        >With snap points</Drawer.Trigger
      ><Drawer.Popup showBar
        ><Drawer.Header
          ><Drawer.Title>Snap Points</Drawer.Title
          ><Drawer.Description
            >Drag the drawer to snap between a compact peek and full-height
            view.</Drawer.Description
          ></Drawer.Header
        ><Drawer.Panel
          ><div class="flex flex-col gap-2">
            {#each boxes as _box}
              <div class="h-12 shrink-0 rounded-xl border bg-muted"></div>
            {/each}
          </div></Drawer.Panel
        ></Drawer.Popup
      ></Drawer.Root
    >
  </section>

  <section data-particle="p-drawer-10">
    <div class="flex flex-wrap gap-2">
      {#each ["default", "bare"] as footerVariant}
        <Drawer.Root position="right"
          ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}
            >{footerVariant === "default" ? "Default footer" : "Bare footer"}</Drawer.Trigger
          ><Drawer.Popup variant="inset"
            >{const profile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}
            <Drawer.Header
              ><Drawer.Title>Edit profile</Drawer.Title
              ><Drawer.Description
                >Make changes to your profile here. Click save when you're done.</Drawer.Description
              ></Drawer.Header
            >
            <Form class="contents"
              ><Drawer.Panel class="grid gap-4"
                ><Field.Root
                  ><Field.Label>Name</Field.Label>
                  <Input bind:value={profile.name} type="text" /></Field.Root
                ><Field.Root
                  ><Field.Label>Username</Field.Label>
                  <Input bind:value={profile.username} type="text" /></Field.Root
                ></Drawer.Panel
              ><Drawer.Footer variant={footerVariant}
                ><Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close
                ><Button>Save</Button></Drawer.Footer
              ></Form
            ></Drawer.Popup
          ></Drawer.Root
        >
      {/each}
    </div>
  </section>

  <section data-particle="p-drawer-11">
    <Drawer.Root position="left"
      ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Drawer.Trigger
      ><Drawer.Popup showCloseButton variant="straight"
        ><Drawer.Header><Drawer.Title>Menu</Drawer.Title></Drawer.Header
        ><Drawer.Panel
          ><nav class="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
            {#each ["Home", "Profile", "Settings", "Sign out"] as item}
              <Drawer.Close
                as="a"
                class={buttonVariants({ class: "justify-start", variant: "ghost" })}
                href="#"
                >{item}</Drawer.Close
              >
            {/each}
          </nav></Drawer.Panel
        ></Drawer.Popup
      ></Drawer.Root
    >
  </section>

  <section data-particle="p-drawer-12">
    {#if isMobile.current}
      <Drawer.Root
        ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open</Drawer.Trigger
        ><Drawer.Popup showBar
          >{const responsiveDrawer = $state({
            name: "Margaret Welsh",
            username: "@maggie.welsh",
          })}
          <Drawer.Header
            ><Drawer.Title>Edit profile</Drawer.Title
            ><Drawer.Description
              >Make changes to your profile here. Click save when you're done.</Drawer.Description
            ></Drawer.Header
          >
          <Form class="contents"
            ><Drawer.Panel class="grid gap-4" scrollable={false}
              ><Field.Root
                ><Field.Label>Name</Field.Label>
                <Input bind:value={responsiveDrawer.name} type="text" /></Field.Root
              ><Field.Root
                ><Field.Label>Username</Field.Label>
                <Input bind:value={responsiveDrawer.username} type="text" /></Field.Root
              ></Drawer.Panel
            ><Drawer.Footer
              ><Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close
              ><Button type="submit">Save</Button></Drawer.Footer
            ></Form
          ></Drawer.Popup
        ></Drawer.Root
      >
    {:else}
      <Dialog.Root
        ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Open</Dialog.Trigger
        ><Dialog.Popup class="sm:max-w-sm"
          >{const responsiveDialog = $state({
            name: "Margaret Welsh",
            username: "@maggie.welsh",
          })}
          <Dialog.Header
            ><Dialog.Title>Edit profile</Dialog.Title
            ><Dialog.Description
              >Make changes to your profile here. Click save when you're done.</Dialog.Description
            ></Dialog.Header
          >
          <Form class="contents"
            ><Dialog.Panel class="grid gap-4"
              ><Field.Root
                ><Field.Label>Name</Field.Label>
                <Input bind:value={responsiveDialog.name} type="text" /></Field.Root
              ><Field.Root
                ><Field.Label>Username</Field.Label>
                <Input bind:value={responsiveDialog.username} type="text" /></Field.Root
              ></Dialog.Panel
            ><Dialog.Footer
              ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
              ><Button type="submit">Save</Button></Dialog.Footer
            ></Form
          ></Dialog.Popup
        ></Dialog.Root
      >
    {/if}
  </section>

  <section data-particle="p-drawer-13">
    {#if isMobile.current}
      <Drawer.Root>
        <Drawer.Trigger
          aria-label="Open menu"
          class={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-ellipsis"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </Drawer.Trigger>
        <Drawer.Popup showBar>
          <Drawer.Panel>
            <Drawer.Menu>
              <Drawer.MenuGroup>
                <Drawer.MenuGroupLabel>Actions</Drawer.MenuGroupLabel>
                <Drawer.Close
                  class={Drawer.drawerMenuItemVariants()}
                  data-slot="drawer-menu-item"
                  data-variant="default"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-pencil"
                    aria-hidden="true"
                  >
                    <path
                      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                    ></path>
                    <path d="m15 5 4 4"></path>
                  </svg
                  >Edit</Drawer.Close
                >
                <Drawer.Close
                  class={Drawer.drawerMenuItemVariants()}
                  data-slot="drawer-menu-item"
                  data-variant="default"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-copy"
                    aria-hidden="true"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg
                  >Duplicate</Drawer.Close
                >
                <Drawer.Close
                  class={Drawer.drawerMenuItemVariants()}
                  data-slot="drawer-menu-item"
                  data-variant="default"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-share"
                    aria-hidden="true"
                  >
                    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"></path>
                    <path d="M12 16V2"></path>
                    <path d="m7 7 5-5 5 5"></path>
                  </svg
                  >Share</Drawer.Close
                >
              </Drawer.MenuGroup>
              <Drawer.MenuSeparator />
              <Drawer.MenuCheckboxItem>Shuffle</Drawer.MenuCheckboxItem>
              <Drawer.MenuCheckboxItem>Repeat</Drawer.MenuCheckboxItem>
              <Drawer.MenuCheckboxItem disabled>Enhanced Audio</Drawer.MenuCheckboxItem>
              <Drawer.MenuSeparator />
              <Drawer.MenuGroup>
                <Drawer.MenuGroupLabel>Sort by</Drawer.MenuGroupLabel>
                <Drawer.MenuRadioGroup defaultValue="artist"
                  ><Drawer.MenuRadioItem value="artist">Artist</Drawer.MenuRadioItem
                  ><Drawer.MenuRadioItem value="album">Album</Drawer.MenuRadioItem
                  ><Drawer.MenuRadioItem value="title"
                    >Title</Drawer.MenuRadioItem
                  ></Drawer.MenuRadioGroup
                >
              </Drawer.MenuGroup>
              <Drawer.MenuSeparator />
              <Drawer.MenuCheckboxItem variant="switch">Auto save</Drawer.MenuCheckboxItem>
              <Drawer.MenuSeparator />
              <Drawer.Root>
                <Drawer.MenuTrigger>Add to Playlist</Drawer.MenuTrigger>
                <Drawer.Popup showBar
                  ><Drawer.Panel
                    ><Drawer.Menu
                      ><Drawer.MenuGroup
                        ><Drawer.MenuGroupLabel
                          >Add to Playlist</Drawer.MenuGroupLabel
                        ></Drawer.MenuGroup
                      ><Drawer.Close
                        class={Drawer.drawerMenuItemVariants()}
                        data-slot="drawer-menu-item"
                        data-variant="default"
                        >Jazz</Drawer.Close
                      ><Drawer.Root
                        ><Drawer.MenuTrigger>Rock</Drawer.MenuTrigger
                        ><Drawer.Popup showBar
                          ><Drawer.Panel
                            ><Drawer.Menu
                              ><Drawer.MenuGroup
                                ><Drawer.MenuGroupLabel
                                  >Rock</Drawer.MenuGroupLabel
                                ></Drawer.MenuGroup
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Hard Rock</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Soft Rock</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Classic Rock</Drawer.Close
                              ><Drawer.MenuSeparator />
                              <Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Metal</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Punk</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Grunge</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Alternative</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Indie</Drawer.Close
                              ><Drawer.Close
                                class={Drawer.drawerMenuItemVariants()}
                                data-slot="drawer-menu-item"
                                data-variant="default"
                                >Electronic</Drawer.Close
                              ></Drawer.Menu
                            ></Drawer.Panel
                          ></Drawer.Popup
                        ></Drawer.Root
                      ><Drawer.Close
                        class={Drawer.drawerMenuItemVariants()}
                        data-slot="drawer-menu-item"
                        data-variant="default"
                        >Pop</Drawer.Close
                      ></Drawer.Menu
                    ></Drawer.Panel
                  ></Drawer.Popup
                >
              </Drawer.Root>
              <Drawer.MenuSeparator />
              <Drawer.MenuGroup>
                <Drawer.MenuGroupLabel>Danger zone</Drawer.MenuGroupLabel>
                <Drawer.Close
                  class={Drawer.drawerMenuItemVariants()}
                  data-slot="drawer-menu-item"
                  data-variant="destructive"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-trash"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg
                  >Delete</Drawer.Close
                >
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
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-ellipsis"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg></Menu.Trigger
        >
        <Menu.Popup>
          <Menu.Group
            ><Menu.GroupLabel>Actions</Menu.GroupLabel
            ><Menu.Item
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-pencil"
                aria-hidden="true"
              >
                <path
                  d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                ></path>
                <path d="m15 5 4 4"></path>
              </svg
              >Edit</Menu.Item
            ><Menu.Item
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-copy"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg
              >Duplicate</Menu.Item
            ><Menu.Item
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-share"
                aria-hidden="true"
              >
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"></path>
                <path d="M12 16V2"></path>
                <path d="m7 7 5-5 5 5"></path>
              </svg
              >Share</Menu.Item
            ></Menu.Group
          >
          <Menu.Separator /><Menu.CheckboxItem>Shuffle</Menu.CheckboxItem
          ><Menu.CheckboxItem>Repeat</Menu.CheckboxItem
          ><Menu.CheckboxItem disabled>Enhanced Audio</Menu.CheckboxItem><Menu.Separator />
          <Menu.Group
            ><Menu.GroupLabel>Sort by</Menu.GroupLabel
            ><Menu.RadioGroup defaultValue="artist"
              ><Menu.RadioItem value="artist">Artist</Menu.RadioItem
              ><Menu.RadioItem value="album">Album</Menu.RadioItem
              ><Menu.RadioItem value="title">Title</Menu.RadioItem></Menu.RadioGroup
            ></Menu.Group
          ><Menu.Separator /><Menu.CheckboxItem variant="switch">Auto save</Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.Sub
            ><Menu.SubTrigger>Add to Playlist</Menu.SubTrigger
            ><Menu.SubPopup
              ><Menu.Item>Jazz</Menu.Item
              ><Menu.Sub
                ><Menu.SubTrigger>Rock</Menu.SubTrigger
                ><Menu.SubPopup
                  ><Menu.Item>Hard Rock</Menu.Item><Menu.Item>Soft Rock</Menu.Item
                  ><Menu.Item>Classic Rock</Menu.Item><Menu.Separator /><Menu.Item>Metal</Menu.Item
                  ><Menu.Item>Punk</Menu.Item><Menu.Item>Grunge</Menu.Item
                  ><Menu.Item>Alternative</Menu.Item><Menu.Item>Indie</Menu.Item
                  ><Menu.Item>Electronic</Menu.Item></Menu.SubPopup
                ></Menu.Sub
              ><Menu.Item>Pop</Menu.Item></Menu.SubPopup
            ></Menu.Sub
          >
          <Menu.Separator />
          <Menu.Group
            ><Menu.GroupLabel>Danger zone</Menu.GroupLabel
            ><Menu.Item variant="destructive"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trash"
                aria-hidden="true"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg
              >Delete</Menu.Item
            ></Menu.Group
          >
        </Menu.Popup>
      </Menu.Root>
    {/if}
  </section>

  <section data-particle="p-drawer-14">
    <div class="relative min-h-80 w-full overflow-hidden rounded-xl border">
      <Drawer.Root modal={false} position="left"
        ><Drawer.SwipeArea class="absolute border-input border-e border-dashed bg-muted"
          ><span
            class="pointer-events-none absolute top-1/2 left-0 ms-2 -translate-y-1/2 rotate-90 whitespace-nowrap font-medium text-muted-foreground text-xs uppercase"
            >Swipe area</span
          ></Drawer.SwipeArea
        >
        <div class="flex min-h-80 items-center justify-center p-6 ps-14 text-center">
          <p class="max-w-56 text-balance text-muted-foreground text-sm">
            Swipe from the left edge to open the menu.
          </p>
        </div>
        <Drawer.Popup position="left" showCloseButton variant="straight"
          ><Drawer.Header><Drawer.Title>Menu</Drawer.Title></Drawer.Header
          ><Drawer.Panel
            ><nav class="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
              {#each ["Home", "Profile", "Settings", "Sign out"] as item}
                <!-- svelte-ignore a11y_invalid_attribute -->
                <Button class="justify-start" href="#" variant="ghost">{item}</Button>
              {/each}
            </nav></Drawer.Panel
          ></Drawer.Popup
        ></Drawer.Root
      >
    </div>
  </section>
</div>

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
