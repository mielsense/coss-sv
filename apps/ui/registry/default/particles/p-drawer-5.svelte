<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer"],
    id: "p-drawer-5",
    interactive: true,
    responsive: true,
    title: "Straight drawer positions",
  });
</script>

<script lang="ts">
  import { buttonVariants, Drawer } from "@coss-sv/ui";

  const positions = [
    { label: "Right", position: "right" },
    { label: "Left", position: "left" },
    { label: "Top", position: "top" },
    { label: "Bottom", position: "bottom" },
  ] as const;
</script>

<div class="flex flex-wrap gap-2">
  {#each positions as item}
    <Drawer.Root position={item.position}>
      <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
        {item.label}
      </Drawer.Trigger><Drawer.Popup variant="straight">
        <Drawer.Header>
          <Drawer.Title>{item.label}</Drawer.Title>
        </Drawer.Header><Drawer.Panel>
          <p class="text-muted-foreground text-sm">
            Content from the {item.position}.
          </p>
        </Drawer.Panel>
      </Drawer.Popup>
    </Drawer.Root>
  {/each}
</div>
