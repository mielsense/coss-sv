<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type AlertVariant = "default" | "error" | "info" | "success" | "warning";
  export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
    variant?: AlertVariant;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-card-foreground text-sm has-[>svg]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-[>svg]:gap-x-2 [&>svg]:h-lh [&>svg]:w-4";
  const variantClasses: Record<AlertVariant, string> = {
    default: "bg-transparent dark:bg-input/32 [&>svg]:text-muted-foreground",
    error: "border-destructive/32 bg-destructive/4 [&>svg]:text-destructive",
    info: "border-info/32 bg-info/4 [&>svg]:text-info",
    success: "border-success/32 bg-success/4 [&>svg]:text-success",
    warning: "border-warning/32 bg-warning/4 [&>svg]:text-warning",
  };

  let {
    children,
    class: className,
    ref = $bindable(null),
    variant = "default",
    ...props
  }: AlertProps = $props();
  const classes = $derived(cn(baseClass, variantClasses[variant], className));
</script>

<div bind:this={ref} class={classes} data-slot="alert" role="alert" {...props}>
  {@render children?.()}
</div>
