<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer"],
    id: "p-drawer-11",
    interactive: true,
    responsive: true,
    title: "Navigation drawer",
  });
</script>

<script lang="ts">
  import { buttonVariants, Drawer } from "@coss-sv/ui";

  const links = ["Home", "Profile", "Settings", "Sign out"];
</script>

<Drawer.Root position="left">
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
    Open menu
  </Drawer.Trigger><Drawer.Popup showCloseButton variant="straight">
    <Drawer.Header>
      <Drawer.Title>Menu</Drawer.Title>
    </Drawer.Header><Drawer.Panel>
      <nav class="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
        {#each links as label}
          <Drawer.Close
            as="a"
            class={buttonVariants({ class: "justify-start", variant: "ghost" })}
            href="#"
          >
            {label}
          </Drawer.Close>
        {/each}
      </nav>
    </Drawer.Panel>
  </Drawer.Popup>
</Drawer.Root>
