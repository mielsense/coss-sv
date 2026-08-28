<script module lang="ts">
import type { SeparatorProps } from "../separator/separator.svelte";

export type SidebarSeparatorProps = SeparatorProps;
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
import Separator from "../separator/separator.svelte";

let { class: className, ref = $bindable(null), ...props }: SidebarSeparatorProps = $props();
</script>
<Separator
  bind:ref
  class={cn("mx-2 w-auto bg-sidebar-border", className)}
  data-sidebar="separator"
  data-slot="sidebar-separator"
  {...props}
/>
