<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-4",
    interactive: true,
    responsive: false,
    title: "Menu with radio group",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root>
  <Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup>
    <Menu.RadioGroup value="system">
      <Menu.RadioItem value="light">Light</Menu.RadioItem><Menu.RadioItem value="dark">
        Dark
      </Menu.RadioItem><Menu.RadioItem value="system">System</Menu.RadioItem>
    </Menu.RadioGroup>
  </Menu.Popup>
</Menu.Root>
