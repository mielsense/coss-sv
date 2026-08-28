<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer"],
    containerClass: "w-full",
    id: "p-drawer-14",
    interactive: true,
    responsive: true,
    title: "Non-modal swipe area drawer",
  });
</script>

<script lang="ts">
  import { Button, Drawer } from "@coss-sv/ui";

  const links = ["Home", "Profile", "Settings", "Sign out"];
</script>

<div class="relative min-h-80 w-full overflow-hidden rounded-xl border">
  <Drawer.Root modal={false} position="left">
    <Drawer.SwipeArea class="absolute border-input border-e border-dashed bg-muted">
      <span
        class="pointer-events-none absolute top-1/2 left-0 ms-2 -translate-y-1/2 rotate-90 whitespace-nowrap font-medium text-muted-foreground text-xs uppercase"
      >
        Swipe area
      </span>
    </Drawer.SwipeArea>
    <div class="flex min-h-80 items-center justify-center p-6 ps-14 text-center">
      <p class="max-w-56 text-balance text-muted-foreground text-sm">
        Swipe from the left edge to open the menu.
      </p>
    </div>
    <Drawer.Popup position="left" showCloseButton variant="straight">
      <Drawer.Header>
        <Drawer.Title>Menu</Drawer.Title>
      </Drawer.Header><Drawer.Panel>
        <nav class="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
          {#each links as label}
            <Button as="a" class="justify-start" href="#" variant="ghost">
              {label}
            </Button>
          {/each}
        </nav>
      </Drawer.Panel>
    </Drawer.Popup>
  </Drawer.Root>
</div>
