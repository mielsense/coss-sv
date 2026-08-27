<!-- biome-ignore-all lint/a11y/useSemanticElements: COSS intentionally groups arbitrary controls in a div. -->
<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { GroupOrientation } from "./group-styles.js";

export type GroupRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
  class?: string;
  children?: Snippet;
  orientation?: GroupOrientation;
  ref?: HTMLDivElement | null;
};
</script>

<script lang="ts">
import { groupClasses } from "./group-styles.js";

let {
  children,
  class: className,
  orientation,
  ref = $bindable(null),
  ...props
}: GroupRootProps = $props();
</script>

<div
  bind:this={ref}
  data-orientation={orientation}
  data-slot="group"
  role="group"
  class={groupClasses({ class: className, orientation })}
  {...props}
>
  {@render children?.()}
</div>
