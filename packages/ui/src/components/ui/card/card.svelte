<script module lang="ts">
export type { CardProps } from "./card-part.svelte";
</script>

<script lang="ts">
import CardPart, { type CardProps } from "./card-part.svelte";

const baseClass =
  "relative flex flex-col rounded-2xl border bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]";
let { ref = $bindable(null), ...props }: CardProps = $props();
</script>

<CardPart bind:ref {baseClass} dataSlot="card" {...props} />
