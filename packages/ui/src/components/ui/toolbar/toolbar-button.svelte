<script lang="ts">
  import { Toolbar as P } from "@shardsui/svelte";
  import type { ToolbarButtonProps } from "./toolbar.types.js";

  let { ref = $bindable(null), ...props }: ToolbarButtonProps = $props();
</script>

<P.Button bind:ref data-slot="toolbar-button" {...props} />
