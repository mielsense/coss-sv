<script lang="ts">
  import EmptyPart, { type EmptyProps } from "./empty-part.svelte";

  const baseClass = "flex max-w-sm flex-col items-center text-center";
  let { ref = $bindable(null), ...props }: EmptyProps = $props();
</script>

<EmptyPart bind:ref {baseClass} dataSlot="empty-header" {...props} />
