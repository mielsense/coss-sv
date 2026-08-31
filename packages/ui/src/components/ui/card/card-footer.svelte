<script lang="ts" generics="Tag extends import('./card-part.svelte').CardTag = 'div'">
  import CardPart, { type CardProps, forwardCardProps } from "./card-part.svelte";

  const baseClass = "flex items-center p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-4";
  let { ref = $bindable(null), ...props }: CardProps<Tag> = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-footer" {...forwardCardProps(props)} />
