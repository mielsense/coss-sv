<script lang="ts">
  import EmptyPart, { type EmptyProps } from "./empty-part.svelte";

  const baseClass =
    "text-muted-foreground text-sm [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 [[data-slot=empty-title]+&]:mt-1";
  let { ref = $bindable(null), ...props }: EmptyProps = $props();
</script>

<EmptyPart bind:ref {baseClass} dataSlot="empty-description" {...props} />
