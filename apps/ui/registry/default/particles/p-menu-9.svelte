<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-9",
    interactive: true,
    responsive: false,
    title: "Menu with checkbox items as switches",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root>
  <Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup>
    <Menu.CheckboxItem defaultChecked variant="switch">
      Auto save
    </Menu.CheckboxItem><Menu.CheckboxItem variant="switch">
      Notifications
    </Menu.CheckboxItem><Menu.CheckboxItem defaultChecked variant="switch">
      Dark mode
    </Menu.CheckboxItem>
  </Menu.Popup>
</Menu.Root>
