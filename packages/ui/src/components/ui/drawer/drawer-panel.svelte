<script module lang="ts">
  import type { DrawerPartProps } from "./drawer-part.svelte";
  export type DrawerPanelProps = DrawerPartProps & {
    allowSelection?: boolean;
    scrollFade?: boolean;
    scrollable?: boolean;
  };
</script>

<script lang="ts">
  import ScrollArea from "../scroll-area/scroll-area.svelte";
  import DrawerPanelContent from "./drawer-panel-content.svelte";
  let {
    ref = $bindable(null),
    scrollFade = true,
    scrollable = true,
    ...props
  }: DrawerPanelProps = $props();
</script>

{#if scrollable}
  <ScrollArea class="touch-auto" overscrollContain {scrollFade}
    ><DrawerPanelContent bind:ref {...props} /></ScrollArea
  >
{:else}
  <DrawerPanelContent bind:ref {...props} />
{/if}
