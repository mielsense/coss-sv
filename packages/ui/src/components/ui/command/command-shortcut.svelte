<script module lang="ts">
  import type { CommandPartProps } from "./command-part.svelte";
  export type CommandShortcutProps = CommandPartProps;
</script>

<script lang="ts">
  import Part from "./command-part.svelte";
  let { ref = $bindable(null), ...props }: CommandShortcutProps = $props();
</script>

<Part
  bind:ref
  as="kbd"
  baseClass="ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest"
  dataSlot="command-shortcut"
  {...props}
/>
