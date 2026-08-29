<script lang="ts">
  import CardPart, { type CardProps } from "./card-part.svelte";

  const baseClass =
    "flex-1 p-6 in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0 in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0";
  let { ref = $bindable(null), ...props }: CardProps = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-panel" {...props} />
