<!-- biome-ignore-all lint/a11y/useSemanticElements: COSS and Shards use a configurable element rather than a fixed hr. -->
<!-- biome-ignore-all lint/a11y/useAriaPropsForRole: A non-focusable separator only requires aria-orientation. -->
<script module lang="ts">
import type { Separator as ShardsSeparator } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";

export type SeparatorOrientation = "horizontal" | "vertical";

export type SeparatorProps = ComponentProps<typeof ShardsSeparator> & {
  children?: Snippet;
};
</script>

<script lang="ts">
import { Separator as SeparatorPrimitive } from "@shardsui/svelte";
import { cn } from "../../../lib/utils.js";

const baseClass =
  "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch";

let {
  as = "div",
  children,
  class: className,
  orientation = "horizontal",
  ref = $bindable(null),
  ...props
}: SeparatorProps = $props();

const classes = $derived(cn(baseClass, className));
</script>

{#if children}
  <svelte:element
    this={as}
    bind:this={ref}
    data-orientation={orientation}
    role="separator"
    aria-orientation={orientation}
    data-slot="separator"
    class={classes}
    {...props}
  >
    {@render children()}
  </svelte:element>
{:else}
  <SeparatorPrimitive
    {as}
    bind:ref
    {orientation}
    data-slot="separator"
    class={classes}
    {...props}
  />
{/if}
