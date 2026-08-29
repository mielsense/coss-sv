<script lang="ts">
  import CardPart, { type CardProps } from "./card-part.svelte";

  const baseClass = "font-heading font-semibold text-lg leading-none";
  let { ref = $bindable(null), ...props }: CardProps = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-title" {...props} />
