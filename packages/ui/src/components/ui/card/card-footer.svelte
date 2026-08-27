<script lang="ts">
import CardPart, { type CardProps } from "./card-part.svelte";

const baseClass = "flex items-center p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-4";
let { ref = $bindable(null), ...props }: CardProps = $props();
</script>
<CardPart bind:ref {baseClass} dataSlot="card-footer" {...props} />
