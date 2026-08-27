<script lang="ts">
import { Toolbar as P } from "@shardsui/svelte";
import type { ToolbarLinkProps } from "./toolbar.types.js";

let { ref = $bindable(null), ...props }: ToolbarLinkProps = $props();
</script>
<P.Link bind:ref data-slot="toolbar-link" {...props} />
