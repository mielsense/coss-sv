<script lang="ts">
import CardPart, { type CardProps } from "./card-part.svelte";

const baseClass = "px-6 py-4";
let { ref = $bindable(null), ...props }: CardProps = $props();
</script>
<CardPart bind:ref {baseClass} dataSlot="card-frame-footer" {...props} />
