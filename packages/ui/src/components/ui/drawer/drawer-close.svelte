<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DrawerCloseProps = ComponentProps<typeof ShardsP.Close>;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: DrawerCloseProps = $props();
</script>
<P.Close bind:ref data-slot="drawer-close" {...props} />
