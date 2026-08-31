<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-7",
    interactive: true,
    responsive: false,
    title: "Nested menu",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root>
  <Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup>
    <Menu.Item>Item one</Menu.Item><Menu.Sub>
      <Menu.SubTrigger>More</Menu.SubTrigger><Menu.SubPopup>
        <Menu.Item>Sub item A</Menu.Item><Menu.Item>Sub item B</Menu.Item>
      </Menu.SubPopup>
    </Menu.Sub><Menu.Item>Item two</Menu.Item>
  </Menu.Popup>
</Menu.Root>
