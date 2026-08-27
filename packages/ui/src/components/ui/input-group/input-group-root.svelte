<!-- biome-ignore-all lint/a11y/useSemanticElements: COSS intentionally groups one control and its addons in a div. -->
<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type InputGroupRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLDivElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";
import { inputGroupClass } from "./input-group-styles.js";

let { children, class: className, ref = $bindable(null), ...props }: InputGroupRootProps = $props();
</script>

<div
  bind:this={ref}
  data-slot="input-group"
  role="group"
  class={cn(inputGroupClass, className)}
  {...props}
>
  {@render children?.()}
</div>
