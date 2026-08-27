<script lang="ts">
import CardPart, { type CardProps } from "./card-part.svelte";

const baseClass = "col-start-2 row-span-2 row-start-1 inline-flex self-start justify-self-end";
let { ref = $bindable(null), ...props }: CardProps = $props();
</script>
<CardPart bind:ref {baseClass} dataSlot="card-action" {...props} />
