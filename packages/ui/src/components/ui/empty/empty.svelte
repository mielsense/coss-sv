<script module lang="ts">
  export type { EmptyProps } from "./empty-part.svelte";
</script>

<script lang="ts">
  import EmptyPart, { type EmptyProps } from "./empty-part.svelte";

  const baseClass =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance px-6 py-12 text-center md:py-20";
  let { ref = $bindable(null), ...props }: EmptyProps = $props();
</script>

<EmptyPart bind:ref {baseClass} dataSlot="empty" {...props} />
