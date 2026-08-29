<script module lang="ts">
  import type { DrawerPartProps } from "./drawer-part.svelte";
  export type DrawerMenuGroupLabelProps = DrawerPartProps;
</script>

<script lang="ts">
  import DrawerPart from "./drawer-part.svelte";
  let { ref = $bindable(null), ...props }: DrawerMenuGroupLabelProps = $props();
</script>

<DrawerPart
  bind:ref
  baseClass="px-2 py-1.5 font-medium text-muted-foreground text-xs"
  dataSlot="drawer-menu-group-label"
  {...props}
/>
