<script module lang="ts">
  import type { DrawerPartProps } from "./drawer-part.svelte";
  export type DrawerMenuSeparatorProps = DrawerPartProps;
</script>

<script lang="ts">
  import DrawerPart from "./drawer-part.svelte";
  let { ref = $bindable(null), ...props }: DrawerMenuSeparatorProps = $props();
</script>

<DrawerPart
  bind:ref
  baseClass="mx-2 my-1 h-px bg-border"
  dataSlot="drawer-menu-separator"
  {...props}
/>
