<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type EmptyMediaVariant = "default" | "icon";
  export type EmptyMediaProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
    variant?: EmptyMediaVariant;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0";
  const variants: Record<EmptyMediaVariant, string> = {
    default: "bg-transparent",
    icon: "relative flex size-9 shrink-0 items-center justify-center rounded-md border bg-card not-dark:bg-clip-padding text-foreground shadow-sm/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5",
  };
  let {
    children,
    class: className,
    ref = $bindable(null),
    variant = "default",
    ...props
  }: EmptyMediaProps = $props();
  const mediaClass = $derived(cn(baseClass, variants[variant], className));
</script>

<div
  bind:this={ref}
  class={cn("relative mb-6", className)}
  data-slot="empty-media"
  data-variant={variant}
  {...props}
>
  {#if variant === "icon"}
    <div
      aria-hidden="true"
      class={cn(
        mediaClass,
        "pointer-events-none absolute bottom-px origin-bottom-left -translate-x-0.5 -rotate-10 scale-84 shadow-none",
      )}
    ></div>
    <div
      aria-hidden="true"
      class={cn(
        mediaClass,
        "pointer-events-none absolute bottom-px origin-bottom-right translate-x-0.5 rotate-10 scale-84 shadow-none",
      )}
    ></div>
  {/if}
  <div class={mediaClass} {...props}>
    {@render children?.()}
  </div>
</div>
