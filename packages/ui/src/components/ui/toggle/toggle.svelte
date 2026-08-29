<script module lang="ts">
  import type { Toggle as ShardsToggle } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  import type { ToggleSize, ToggleVariant } from "./toggle-variants.js";

  export type ToggleProps = ComponentProps<typeof ShardsToggle> & {
    size?: ToggleSize;
    variant?: ToggleVariant;
  };
</script>

<script lang="ts">
  import { Toggle as TogglePrimitive } from "@shardsui/svelte";
  import { toggleVariants } from "./toggle-variants.js";

  let {
    class: className,
    pressed = $bindable(false),
    ref = $bindable(null),
    size = "default",
    variant = "default",
    ...props
  }: ToggleProps = $props();

  const classes = $derived(toggleVariants({ class: className, size, variant }));
</script>

<TogglePrimitive bind:pressed bind:ref data-slot="toggle" class={classes} {...props} />
