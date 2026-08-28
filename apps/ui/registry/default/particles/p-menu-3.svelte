<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-3",
    interactive: true,
    responsive: false,
    title: "Menu with checkbox",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root
  ><Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup
    ><Menu.CheckboxItem defaultChecked>Auto save</Menu.CheckboxItem><Menu.CheckboxItem
      >Notifications</Menu.CheckboxItem
    ></Menu.Popup
  ></Menu.Root
>
