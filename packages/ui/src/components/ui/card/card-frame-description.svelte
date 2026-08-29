<script lang="ts">
  import CardPart, { type CardProps } from "./card-part.svelte";

  const baseClass = "self-center text-muted-foreground text-sm";
  let { ref = $bindable(null), ...props }: CardProps = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-frame-description" {...props} />
