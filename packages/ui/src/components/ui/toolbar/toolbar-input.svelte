<script module lang="ts">
  import type { Toolbar as ShardsToolbar } from "@shardsui/svelte/toolbar";
  import type { ComponentProps } from "svelte";
  export type ToolbarInputProps = ComponentProps<typeof ShardsToolbar.Input>;
</script>

<script lang="ts">
  import { Toolbar as P } from "@shardsui/svelte/toolbar";

  let { ref = $bindable(null), ...props }: ToolbarInputProps = $props();
</script>

<P.Input bind:ref data-slot="toolbar-input" {...props} />
