<script lang="ts">
  import EmptyPart, { type EmptyProps } from "./empty-part.svelte";

  const baseClass = "font-heading font-semibold text-xl";
  let { ref = $bindable(null), ...props }: EmptyProps = $props();
</script>

<EmptyPart bind:ref {baseClass} dataSlot="empty-title" {...props} />
