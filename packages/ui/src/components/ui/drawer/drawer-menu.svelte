<script module lang="ts">
import type { DrawerPartProps } from "./drawer-part.svelte";
export type DrawerMenuProps = DrawerPartProps;
</script>
<script lang="ts">
import DrawerPart from "./drawer-part.svelte";
let { as = "nav", ref = $bindable(null), ...props }: DrawerMenuProps = $props();
</script>
<DrawerPart {as} bind:ref baseClass="-m-2 flex flex-col" dataSlot="drawer-menu" {...props} />
