<script lang="ts">
  import { Toolbar as P } from "@shardsui/svelte/toolbar";
  import { cn } from "@/utils.js";
  import type { ToolbarGroupProps } from "./toolbar.types.js";

  let { class: className, ref = $bindable(null), ...props }: ToolbarGroupProps = $props();
</script>

<P.Group
  bind:ref
  class={cn("flex items-center gap-1", className)}
  data-slot="toolbar-group"
  {...props}
/>
