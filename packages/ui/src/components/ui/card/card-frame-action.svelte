<script lang="ts" generics="Tag extends import('./card-part.svelte').CardTag = 'div'">
  import CardPart, { type CardProps, forwardCardProps } from "./card-part.svelte";

  const baseClass =
    "col-start-2 nth-3:row-span-2 nth-3:row-start-1 inline-flex self-center justify-self-end";
  let { ref = $bindable(null), ...props }: CardProps<Tag> = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-frame-action" {...forwardCardProps(props)} />
