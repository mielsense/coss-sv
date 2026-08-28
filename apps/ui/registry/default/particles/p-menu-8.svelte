<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-8",
    interactive: true,
    responsive: false,
    title: "Menu close on click",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root
  ><Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup
    ><Menu.Item closeOnClick>Profile</Menu.Item><Menu.Item closeOnClick>Settings</Menu.Item
    ><Menu.Item closeOnClick>Log out</Menu.Item></Menu.Popup
  ></Menu.Root
>
