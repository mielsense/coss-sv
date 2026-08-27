<script lang="ts" generics="Payload = unknown">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import type { MenuTriggerProps } from "./menu.types.js";

let { children: child, ref = $bindable(null), ...props }: MenuTriggerProps<Payload> = $props();
</script>

<MenuPrimitive.Trigger bind:ref data-slot="menu-trigger" {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</MenuPrimitive.Trigger>
