<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  export type BreadcrumbLinkProps = HTMLAnchorAttributes & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    as = "a",
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: BreadcrumbLinkProps = $props();
</script>

<svelte:element
  this={as}
  class={cn("transition-colors hover:text-foreground", className)}
  data-slot="breadcrumb-link"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</svelte:element>
