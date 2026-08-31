<script module lang="ts">
  import type { Switch as ShardsSwitch } from "@shardsui/svelte/switch";
  import type { ComponentProps } from "svelte";
  import type { ChangeEventDetails } from "@/change-event-details.js";

  export type SwitchChangeEventDetails = ChangeEventDetails<"none">;

  export type SwitchProps = Omit<
    ComponentProps<typeof ShardsSwitch.Root>,
    "checked" | "onCheckedChange"
  > & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean, eventDetails: SwitchChangeEventDetails) => void;
  };
</script>

<script lang="ts">
  import { Switch as SwitchPrimitive } from "@shardsui/svelte/switch";
  import { untrack } from "svelte";
  import { createChangeEventDetails } from "@/change-event-details.js";
  import { cn } from "@/utils.js";

  const rootClass =
    "inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow] duration-200 [--thumb-size:--spacing(5)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-disabled:cursor-not-allowed data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64 sm:[--thumb-size:--spacing(4)]";
  const thumbClass =
    "pointer-events-none block aspect-square h-full origin-left in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-x-110 in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.1)] rounded-(--thumb-size) bg-background shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] data-checked:origin-[var(--thumb-size)_50%] data-checked:translate-x-[calc(var(--thumb-size)-4px)]";

  let {
    checked = $bindable(),
    class: className,
    defaultChecked = false,
    onCheckedChange,
    onclick,
    ref = $bindable(null),
    ...props
  }: SwitchProps = $props();

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

<SwitchPrimitive.Root
  bind:checked={getChecked, setChecked}
  bind:ref
  data-slot="switch"
  class={classes}
  onCheckedChange={handleCheckedChange}
  onclick={(event) => {
    recordedEvent = event;
    onclick?.(event);
  }}
  {...props}
>
  <SwitchPrimitive.Thumb data-slot="switch-thumb" class={thumbClass} />
</SwitchPrimitive.Root>
