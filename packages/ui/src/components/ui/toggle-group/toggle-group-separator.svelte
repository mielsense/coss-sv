<script module lang="ts">
  import type { SeparatorProps } from "../separator/separator.svelte";

  export type ToggleGroupSeparatorProps = SeparatorProps;
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import Separator from "../separator/separator.svelte";

  let {
    class: className,
    orientation = "vertical",
    ref = $bindable(null),
    ...props
  }: ToggleGroupSeparatorProps = $props();

  const classes = $derived(
    cn(
      "pointer-events-none relative bg-input before:absolute before:inset-0 dark:before:bg-input/32",
      className,
    ),
  );
</script>

<Separator bind:ref {orientation} class={classes} {...props} />
