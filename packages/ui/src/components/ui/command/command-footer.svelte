<script module lang="ts">
import type { CommandPartProps } from "./command-part.svelte";
export type CommandFooterProps = CommandPartProps;
</script>
<script lang="ts">
import Part from "./command-part.svelte";
let { ...props }: CommandFooterProps = $props();
</script>
<Part
  baseClass="flex items-center justify-between gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] border-t px-5 py-3 text-muted-foreground text-xs"
  dataSlot="command-footer"
  {...props}
/>
