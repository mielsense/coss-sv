<script module lang="ts">
  import type { Slider as ShardsSlider } from "@shardsui/svelte/slider";
  import type { ComponentProps } from "svelte";
  import type { ChangeEventDetails, GenericEventDetails } from "@/change-event-details.js";

  export type SliderValueType = number | readonly number[];
  export type SliderChangeEventReason =
    | "drag"
    | "input-change"
    | "keyboard"
    | "none"
    | "track-press";
  export type SliderChangeEventDetails = ChangeEventDetails<
    SliderChangeEventReason,
    { readonly activeThumbIndex: number }
  >;
  export type SliderCommitEventDetails = GenericEventDetails<SliderChangeEventReason>;
  type ShardsSliderRootProps = ComponentProps<typeof ShardsSlider.Root>;

  export type SliderRootProps = Omit<
    ShardsSliderRootProps,
    "onValueChange" | "onValueCommitted" | "value"
  > & {
    defaultValue?: SliderValueType;
    onValueChange?: (value: SliderValueType, eventDetails: SliderChangeEventDetails) => void;
    onValueCommitted?: (value: SliderValueType, eventDetails: SliderCommitEventDetails) => void;
    value?: SliderValueType;
  };
</script>

<script lang="ts">
  import { Slider as SliderPrimitive } from "@shardsui/svelte/slider";
  import { type Component, onDestroy, tick, untrack } from "svelte";
  import { createChangeEventDetails, createGenericEventDetails } from "@/change-event-details.js";
  import { cn } from "@/utils.js";
  import SliderControl from "./slider-control.svelte";
  import SliderIndicator from "./slider-indicator.svelte";
  import SliderThumb from "./slider-thumb.svelte";
  import SliderTrack from "./slider-track.svelte";

  const StyledSliderPrimitiveRoot = SliderPrimitive.Root as Component<
    ShardsSliderRootProps,
    object,
    "ref" | "value"
  >;

  let {
    children: outerChildren,
    class: className,
    defaultValue,
    max = 100,
    min = 0,
    oninputcapture,
    onkeydowncapture,
    onpointerdowncapture,
    onpointermovecapture,
    onValueChange,
    onValueCommitted,
    ref = $bindable(null),
    thumbAlignment = "edge",
    value = $bindable(),
    ...props
  }: SliderRootProps = $props();

  const initialDefaultValue = untrack(() => defaultValue);
  const currentValue = $derived(value ?? initialDefaultValue ?? min);
  let primitiveValue = $state<SliderValueType>(untrack(() => value ?? initialDefaultValue ?? min));
  let pendingChange:
    | {
        readonly activeThumbIndex: number;
        readonly canceled: boolean;
        readonly value: SliderValueType;
      }
    | undefined;
  let recordedEvent: Event | undefined;
  let recordedReason: SliderChangeEventReason = "none";
  let suppressNextCommit = false;
  let pointerController: AbortController | undefined;
  const thumbCount = $derived(Array.isArray(currentValue) ? currentValue.length : 1);
  const classes = $derived(cn("data-[orientation=horizontal]:w-full", className));

  function valuesEqual(left: SliderValueType, right: SliderValueType): boolean {
    if (left === right) return true;
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((entry, index) => entry === right[index])
    );
  }

  function activeThumbIndex(next: SliderValueType): number {
    if (!Array.isArray(next) || !Array.isArray(currentValue)) return 0;
    const index = next.findIndex((entry, entryIndex) => entry !== currentValue[entryIndex]);
    return index === -1 ? 0 : index;
  }

  function setPrimitiveValue(next: SliderValueType) {
    if (pendingChange && valuesEqual(pendingChange.value, next)) {
      const { canceled } = pendingChange;
      const { activeThumbIndex: changedThumbIndex } = pendingChange;
      pendingChange = undefined;
      if (canceled) {
        const input = recordedEvent?.target;
        const restoredValue = Array.isArray(currentValue)
          ? currentValue[changedThumbIndex]
          : currentValue;
        if (input instanceof HTMLInputElement && restoredValue !== undefined) {
          input.value = String(restoredValue);
        }
        suppressNextCommit = true;
        return;
      }
    }

    primitiveValue = next;
    value = next;

    if (!valuesEqual(currentValue, next)) {
      void tick().then(() => {
        primitiveValue = currentValue;
      });
    }
  }

  function handleValueChange(next: SliderValueType): void {
    const event = recordedEvent;
    const trigger = event?.target instanceof Element ? event.target : undefined;
    const details = createChangeEventDetails(recordedReason, event, trigger, {
      activeThumbIndex: activeThumbIndex(next),
    });
    onValueChange?.(next, details);
    pendingChange = {
      activeThumbIndex: details.activeThumbIndex,
      canceled: details.isCanceled,
      value: next,
    };
  }

  function handleValueCommitted(next: SliderValueType): void {
    if (suppressNextCommit) {
      suppressNextCommit = false;
      recordedEvent = undefined;
      recordedReason = "none";
      return;
    }
    onValueCommitted?.(next, createGenericEventDetails(recordedReason, recordedEvent));
    recordedEvent = undefined;
    recordedReason = "none";
  }

  function recordInteraction(event: Event, reason: SliderChangeEventReason): void {
    recordedEvent = event;
    recordedReason = reason;
  }

  function trackPointer(event: PointerEvent): void {
    pointerController?.abort();
    const controller = new AbortController();
    pointerController = controller;
    const doc = (event.currentTarget as HTMLElement).ownerDocument;
    doc.addEventListener("pointermove", (moveEvent) => recordInteraction(moveEvent, "drag"), {
      passive: true,
      signal: controller.signal,
    });
    const finish = () => {
      controller.abort();
      if (pointerController === controller) pointerController = undefined;
    };
    doc.addEventListener("pointerup", finish, { once: true, signal: controller.signal });
    doc.addEventListener("pointercancel", finish, { once: true, signal: controller.signal });
  }

  onDestroy(() => pointerController?.abort());

  $effect(() => {
    primitiveValue = currentValue;
  });
</script>

<StyledSliderPrimitiveRoot
  bind:ref
  bind:value={() => primitiveValue, setPrimitiveValue}
  {min}
  {max}
  {thumbAlignment}
  oninputcapture={(event) => {
    recordInteraction(event, "input-change");
    oninputcapture?.(event);
  }}
  onkeydowncapture={(event) => {
    recordInteraction(event, "keyboard");
    onkeydowncapture?.(event);
  }}
  onpointerdowncapture={(event) => {
    recordInteraction(event, "track-press");
    trackPointer(event);
    onpointerdowncapture?.(event);
  }}
  onpointermovecapture={(event) => {
    recordInteraction(event, "drag");
    onpointermovecapture?.(event);
  }}
  onValueChange={handleValueChange}
  onValueCommitted={handleValueCommitted}
  class={classes}
  {...props}
>
  {#snippet children(state)}
    {@render outerChildren?.(state)}
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        {#each Array(thumbCount) as _, index (index)}
          <SliderThumb {index} />
        {/each}
      </SliderTrack>
    </SliderControl>
  {/snippet}
</StyledSliderPrimitiveRoot>
