<script lang="ts">
  import { cn } from "@coss-sv/ui";
  import type { Snippet } from "svelte";

  let {
    children,
    class: className = "",
    withGradient = true,
  }: { children: Snippet; class?: string; withGradient?: boolean } = $props();
</script>

<div
  class={cn(
    "relative flex w-full max-w-72 flex-col rounded-2xl border border-border text-card-foreground shadow-md/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_-1px_--theme(--color-white/6%),0_1px_--theme(--color-black/6%)]",
    withGradient
      ? "bg-linear-to-b from-[color-mix(in_srgb,var(--card)_96%,var(--color-white))] to-[color-mix(in_srgb,var(--card)_99%,var(--color-black))] dark:to-[color-mix(in_srgb,var(--card)_98%,var(--color-white))]"
      : "bg-card/99 dark:bg-card",
    className,
  )}
>
  {@render children()}
</div>
