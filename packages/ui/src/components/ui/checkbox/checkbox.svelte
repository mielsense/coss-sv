<script module lang="ts">
import type { Checkbox as ShardsCheckbox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type CheckboxProps = ComponentProps<typeof ShardsCheckbox.Root>;
</script>

<script lang="ts">
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Checkbox as CheckboxPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

const rootClass =
  "relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-[.25rem] border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 outline-none ring-ring transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[3px] not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:cursor-not-allowed data-disabled:opacity-64 sm:size-4 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [[data-disabled],[data-checked],[aria-invalid]]:shadow-none";
const indicatorClass =
  "absolute -inset-px flex items-center justify-center rounded-[.25rem] text-primary-foreground data-unchecked:hidden data-checked:bg-primary data-indeterminate:text-foreground";

let {
  checked = $bindable(false),
  class: className,
  ref = $bindable(null),
  ...props
}: CheckboxProps = $props();

const classes = $derived(cn(rootClass, className));
</script>

<CheckboxPrimitive.Root bind:checked bind:ref data-slot="checkbox" class={classes} {...props}>
  <CheckboxPrimitive.Indicator keepMounted data-slot="checkbox-indicator" class={indicatorClass}>
    {#snippet children(state)}
      {#if state.indeterminate}
        <HugeiconsIcon
          aria-hidden="true"
          class="size-3.5 sm:size-3"
          icon={MinusSignIcon}
          strokeWidth={2}
        />
      {:else}
        <HugeiconsIcon
          aria-hidden="true"
          class="size-3.5 sm:size-3"
          icon={Tick02Icon}
          strokeWidth={2}
        />
      {/if}
    {/snippet}
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
