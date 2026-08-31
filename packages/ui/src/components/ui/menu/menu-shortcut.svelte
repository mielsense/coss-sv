<script lang="ts">
  import { cn } from "@/utils.js";
  import type { MenuShortcutProps } from "./menu.types.js";

  let { children, class: className, ref = $bindable(null), ...props }: MenuShortcutProps = $props();
</script>

<kbd
  bind:this={ref}
  class={cn(
    "ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest",
    className,
  )}
  data-slot="menu-shortcut"
  {...props}
>
  {@render children?.()}
</kbd>
