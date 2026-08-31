<script lang="ts" generics="Tag extends import('./card-part.svelte').CardTag = 'div'">
  import CardPart, { type CardProps, forwardCardProps } from "./card-part.svelte";

  const baseClass =
    "relative flex grid auto-rows-min grid-rows-[auto_auto] flex-col items-start gap-x-4 px-6 py-4 has-data-[slot=card-frame-action]:grid-cols-[1fr_auto]";
  let { ref = $bindable(null), ...props }: CardProps<Tag> = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card-frame-header" {...forwardCardProps(props)} />
