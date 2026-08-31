<script lang="ts" generics="Tag extends import('./card-part.svelte').CardTag = 'div'">
  import CardPart, { type CardProps, forwardCardProps } from "./card-part.svelte";

  const baseClass = "font-heading font-semibold text-lg leading-none";
  let { ref = $bindable(null), ...props }: CardProps<Tag> = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-title" {...forwardCardProps(props)} />
