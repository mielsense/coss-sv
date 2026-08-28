<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-6",
    interactive: true,
    responsive: false,
    title: "Menu with group labels",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root
  ><Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup
    ><Menu.Group
      ><Menu.GroupLabel>Account</Menu.GroupLabel><Menu.Item>Profile</Menu.Item><Menu.Item
        >Billing</Menu.Item
      ></Menu.Group
    ><Menu.Separator /><Menu.Group
      ><Menu.GroupLabel>Support</Menu.GroupLabel><Menu.Item>Docs</Menu.Item><Menu.Item
        >Contact</Menu.Item
      ></Menu.Group
    ></Menu.Popup
  ></Menu.Root
>
