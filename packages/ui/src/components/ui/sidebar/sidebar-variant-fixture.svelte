<script lang="ts">
  import * as Sidebar from "./index.js";
  import type { SidebarCollapsible, SidebarSide, SidebarVariant } from "./sidebar-root.svelte";

  let {
    collapsible = "offcanvas",
    open = false,
    side = "left",
    variant = "sidebar",
  }: {
    collapsible?: SidebarCollapsible;
    open?: boolean;
    side?: SidebarSide;
    variant?: SidebarVariant;
  } = $props();
</script>

<Sidebar.Provider defaultOpen={open}>
  <Sidebar.Root {collapsible} {side} {variant}>Content</Sidebar.Root>
</Sidebar.Provider>
