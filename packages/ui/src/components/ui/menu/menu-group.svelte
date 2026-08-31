<script module lang="ts">
  import type { Menu as ShardsMenu } from "@shardsui/svelte/menu";
  import type { ComponentProps } from "svelte";
  export type MenuGroupProps = ComponentProps<typeof ShardsMenu.Group>;
</script>

<script lang="ts">
  import { Menu as MenuPrimitive } from "@shardsui/svelte/menu";

  let { ref = $bindable(null), ...props }: MenuGroupProps = $props();
</script>

<MenuPrimitive.Group bind:ref data-slot="menu-group" {...props} />
