<script module lang="ts">
  import type { Drawer as ShardsP } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type DrawerContentProps = ComponentProps<typeof ShardsP.Content>;
</script>

<script lang="ts">
  import { Drawer as P } from "@shardsui/svelte";
  let { ref = $bindable(null), ...props }: DrawerContentProps = $props();
</script>

<P.Content bind:ref {...props} />
