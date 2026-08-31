<script module lang="ts">
  import type { Drawer as ShardsP } from "@shardsui/svelte/drawer";
  import type { ComponentProps } from "svelte";
  export type DrawerContentProps = ComponentProps<typeof ShardsP.Content>;
</script>

<script lang="ts">
  import { Drawer as P } from "@shardsui/svelte/drawer";
  let { ref = $bindable(null), ...props }: DrawerContentProps = $props();
</script>

<P.Content bind:ref {...props} />
