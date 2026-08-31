<script module lang="ts">
  import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte/context-menu";
  import type { ComponentProps } from "svelte";
  export type ContextMenuGroupProps = ComponentProps<typeof ShardsContextMenu.Group>;
</script>

<script lang="ts">
  import { ContextMenu as P } from "@shardsui/svelte/context-menu";

  let { ref = $bindable(null), ...props }: ContextMenuGroupProps = $props();
</script>

<P.Group bind:ref data-slot="context-menu-group" {...props} />
