<script lang="ts">
  import { Menu as MenuPrimitive } from "@shardsui/svelte/menu";
  import { cn } from "@/utils.js";
  import type { MenuSeparatorProps } from "./menu.types.js";

  let { class: className, ref = $bindable(null), ...props }: MenuSeparatorProps = $props();
</script>

<MenuPrimitive.Separator
  bind:ref
  class={cn("mx-2 my-1 h-px bg-border", className)}
  data-slot="menu-separator"
  {...props}
/>
