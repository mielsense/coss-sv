<script module lang="ts">
import type { Toolbar as ShardsToolbar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ToolbarButtonProps = ComponentProps<typeof ShardsToolbar.Button>;
</script>
<script lang="ts">
import { Toolbar as P } from "@shardsui/svelte";

let { ref = $bindable(null), ...props }: ToolbarButtonProps = $props();
</script>
<P.Button bind:ref data-slot="toolbar-button" {...props} />
