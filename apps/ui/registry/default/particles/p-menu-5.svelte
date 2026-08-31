<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-5",
    interactive: true,
    responsive: false,
    title: "Menu with link",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root>
  <Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger><Menu.Popup>
    <Menu.LinkItem href="/docs">Docs</Menu.LinkItem><Menu.LinkItem href="/particles">
      Particles
    </Menu.LinkItem>
  </Menu.Popup>
</Menu.Root>
