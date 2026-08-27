<script module lang="ts">
import type { CommandPartProps } from "./command-part.svelte";
export type CommandPanelProps = CommandPartProps;
</script>
<script lang="ts">
import Part from "./command-part.svelte";
let { ...props }: CommandPanelProps = $props();
</script>
<Part
  baseClass="relative -mx-px not-has-[+[data-slot=command-footer]]:-mb-px min-h-0 rounded-t-xl not-has-[+[data-slot=command-footer]]:rounded-b-2xl border border-b-0 bg-popover bg-clip-padding shadow-xs/5 [clip-path:inset(0_1px)] not-has-[+[data-slot=command-footer]]:[clip-path:inset(0_1px_1px_1px_round_0_0_calc(var(--radius-2xl)-1px)_calc(var(--radius-2xl)-1px))] before:pointer-events-none before:absolute before:inset-0 before:rounded-t-[calc(var(--radius-xl)-1px)] **:data-[slot=scroll-area-scrollbar]:mt-2"
  dataSlot="command-panel"
  {...props}
/>
