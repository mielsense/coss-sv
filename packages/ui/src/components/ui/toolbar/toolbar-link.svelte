<script module lang="ts">
import type { Toolbar as ShardsToolbar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ToolbarLinkProps = ComponentProps<typeof ShardsToolbar.Link>;
</script>
<script lang="ts">
import { Toolbar as P } from "@shardsui/svelte";

let { ref = $bindable(null), ...props }: ToolbarLinkProps = $props();
</script>
<P.Link bind:ref data-slot="toolbar-link" {...props} />
