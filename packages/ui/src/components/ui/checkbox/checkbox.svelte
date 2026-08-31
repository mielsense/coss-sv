<script module lang="ts">
  import type { Checkbox as ShardsCheckbox } from "@shardsui/svelte/checkbox";
  import type { ComponentProps } from "svelte";
  import type { ChangeEventDetails } from "@/change-event-details.js";

  export type CheckboxChangeEventDetails = ChangeEventDetails<"none">;

  export type CheckboxProps = Omit<
    ComponentProps<typeof ShardsCheckbox.Root>,
    "checked" | "onCheckedChange"
  > & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean, eventDetails: CheckboxChangeEventDetails) => void;
  };
</script>

<script lang="ts">
  import MinusSignIcon from "@hugeicons/core-free-icons/MinusSignIcon";
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { Checkbox as CheckboxPrimitive } from "@shardsui/svelte/checkbox";
  import { untrack } from "svelte";
  import { createChangeEventDetails } from "@/change-event-details.js";
  import { cn } from "@/utils.js";

  const rootClass =
    "relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-[.25rem] border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 outline-none ring-ring transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[3px] not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:cursor-not-allowed data-disabled:opacity-64 sm:size-4 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [[data-disabled],[data-checked],[aria-invalid]]:shadow-none";
  const indicatorClass =
    "absolute -inset-px flex items-center justify-center rounded-[.25rem] text-primary-foreground data-unchecked:hidden data-checked:bg-primary data-indeterminate:text-foreground";

  let {
    checked = $bindable(),
    class: className,
    defaultChecked = false,
    onCheckedChange,
    onclick,
    ref = $bindable(null),
    ...props
  }: CheckboxProps = $props();

  const isControlled = untrack(() => checked !== undefined);
  let internalChecked = $state(untrack(() => defaultChecked));
  let pendingChange: { canceled: boolean; value: boolean } | undefined;
  let recordedEvent: Event | undefined;
  const currentChecked = $derived(isControlled ? (checked as boolean) : internalChecked);
  const classes = $derived(cn(rootClass, className));

  function getChecked(): boolean {
    return currentChecked;
  }

  function setChecked(next: boolean): void {
    if (pendingChange?.value === next) {
      const { canceled } = pendingChange;
      pendingChange = undefined;
      if (canceled) return;
    }
    if (!isControlled) internalChecked = next;
    checked = next;
  }

  function handleCheckedChange(next: boolean): void {
    const event = recordedEvent;
    recordedEvent = undefined;
    const trigger = event?.currentTarget instanceof Element ? event.currentTarget : undefined;
    const details = createChangeEventDetails("none", event, trigger);
    onCheckedChange?.(next, details);
    pendingChange = { canceled: details.isCanceled, value: next };
  }
</script>

<CheckboxPrimitive.Root
  bind:checked={getChecked, setChecked}
  bind:ref
  data-slot="checkbox"
  class={classes}
  onCheckedChange={handleCheckedChange}
  onclick={(event) => {
    recordedEvent = event;
    onclick?.(event);
  }}
  {...props}
>
  <CheckboxPrimitive.Indicator keepMounted data-slot="checkbox-indicator" class={indicatorClass}>
    {#snippet children(state)}
      {#if state.indeterminate}
        <HugeiconsIcon
          aria-hidden="true"
          class="size-3.5 sm:size-3"
          icon={MinusSignIcon}
          strokeWidth={3}
        />
      {:else}
        <HugeiconsIcon
          aria-hidden="true"
          class="size-3.5 sm:size-3"
          icon={Tick02Icon}
          strokeWidth={3}
        />
      {/if}
    {/snippet}
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
