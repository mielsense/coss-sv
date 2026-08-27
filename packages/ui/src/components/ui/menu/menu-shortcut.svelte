<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
export type MenuShortcutProps = HTMLAttributes<HTMLElement> & {
  children?: Snippet;
  ref?: HTMLElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { children, class: className, ref = $bindable(null), ...props }: MenuShortcutProps = $props();
</script>

<kbd
  bind:this={ref}
  class={cn("ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest", className)}
  data-slot="menu-shortcut"
  {...props}
>
  {@render children?.()}
</kbd>
