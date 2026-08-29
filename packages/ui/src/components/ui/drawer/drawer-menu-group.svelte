<script module lang="ts">
  import type { DrawerPartProps } from "./drawer-part.svelte";
  export type DrawerMenuGroupProps = DrawerPartProps;
</script>

<script lang="ts">
  import DrawerPart from "./drawer-part.svelte";
  let { ref = $bindable(null), ...props }: DrawerMenuGroupProps = $props();
</script>

<DrawerPart bind:ref baseClass="flex flex-col" dataSlot="drawer-menu-group" {...props} />
