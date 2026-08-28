<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "menu"],
    id: "p-menu-2",
    interactive: true,
    responsive: false,
    title: "Menu with hover",
  });
</script>

<script lang="ts">
  import { buttonVariants, Menu } from "@coss-sv/ui";
</script>

<Menu.Root
  ><Menu.Trigger class={buttonVariants({ variant: "outline" })} openOnHover>Hover me</Menu.Trigger
  ><Menu.Popup><Menu.Item>Item one</Menu.Item><Menu.Item>Item two</Menu.Item></Menu.Popup
  ></Menu.Root
>
