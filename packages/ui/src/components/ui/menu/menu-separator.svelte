<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type MenuSeparatorProps = ComponentProps<typeof ShardsMenu.Separator>;
</script>

<script lang="ts">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: MenuSeparatorProps = $props();
</script>

<MenuPrimitive.Separator
  bind:ref
  class={cn("mx-2 my-1 h-px bg-border", className)}
  data-slot="menu-separator"
  {...props}
/>
