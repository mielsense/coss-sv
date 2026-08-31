<script lang="ts" generics="Tag extends import('./card-part.svelte').CardTag = 'div'">
  import CardPart, { type CardProps, forwardCardProps } from "./card-part.svelte";

  const baseClass = "self-center text-muted-foreground text-sm";
  let { ref = $bindable(null), ...props }: CardProps<Tag> = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-frame-description" {...forwardCardProps(props)} />
