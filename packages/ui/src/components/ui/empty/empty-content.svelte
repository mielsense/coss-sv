<script lang="ts">
import EmptyPart, { type EmptyProps } from "./empty-part.svelte";

const baseClass = "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm";
let { ref = $bindable(null), ...props }: EmptyProps = $props();
</script>
<EmptyPart bind:ref {baseClass} dataSlot="empty-content" {...props} />
