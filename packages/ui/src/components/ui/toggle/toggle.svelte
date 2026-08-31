<script module lang="ts">
  import type { Toggle as ShardsToggle } from "@shardsui/svelte/toggle";
  import type { ComponentProps } from "svelte";
  import type { ChangeEventDetails } from "@/change-event-details.js";
  import type { ToggleSize, ToggleVariant } from "./toggle-variants.js";

  export type ToggleChangeEventDetails = ChangeEventDetails<"none">;

  export type ToggleProps = Omit<
    ComponentProps<typeof ShardsToggle>,
    "onPressedChange" | "pressed"
  > & {
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean, eventDetails: ToggleChangeEventDetails) => void;
    pressed?: boolean;
    size?: ToggleSize;
    variant?: ToggleVariant;
  };
</script>

<script lang="ts">
  import { Toggle as TogglePrimitive } from "@shardsui/svelte/toggle";
  import { untrack } from "svelte";
  import { createChangeEventDetails } from "@/change-event-details.js";
  import { getToggleGroupItemChangeContext } from "./group-change-context.js";
  import { toggleVariants } from "./toggle-variants.js";

  let {
    class: className,
    defaultPressed = false,
    onPressedChange,
    onclick,
    pressed = $bindable(),
    ref = $bindable(null),
    size = "default",
    variant = "default",
    ...props
  }: ToggleProps = $props();

  const isControlled = untrack(() => pressed !== undefined);
  const groupChange = getToggleGroupItemChangeContext();
  let internalPressed = $state(untrack(() => defaultPressed));
  let pendingChange: { canceled: boolean; value: boolean } | undefined;
  let recordedEvent: Event | undefined;
  const currentPressed = $derived(isControlled ? (pressed as boolean) : internalPressed);
  const classes = $derived(toggleVariants({ class: className, size, variant }));

  function getPressed(): boolean {
    return currentPressed;
  }

  function setPressed(next: boolean): void {
    if (pendingChange?.value === next) {
      const { canceled } = pendingChange;
      pendingChange = undefined;
      if (canceled) return;
    }
    if (!isControlled) internalPressed = next;
    pressed = next;
  }

  function handlePressedChange(next: boolean): void {
    const event = recordedEvent;
    recordedEvent = undefined;
    const trigger = event?.currentTarget instanceof Element ? event.currentTarget : undefined;
    const details = createChangeEventDetails("none", event, trigger);
    onPressedChange?.(next, details);
    groupChange?.prepare(details);
    pendingChange = { canceled: details.isCanceled, value: next };
  }
</script>

<TogglePrimitive
  bind:pressed={getPressed, setPressed}
  bind:ref
  data-slot="toggle"
  class={classes}
  onPressedChange={handlePressedChange}
  onclick={(event) => {
    recordedEvent = event;
    onclick?.(event);
  }}
  {...props}
/>
