<script module lang="ts">
  import type { Tabs as ShardsTabs } from "@shardsui/svelte/tabs";
  import type { ComponentProps } from "svelte";
  import type { TabsChangeEventDetails } from "./tabs-change-details.js";
  import type { TabsValue } from "./tabs-value.js";

  export type TabsRootProps<Value = TabsValue> = Omit<
    ComponentProps<typeof ShardsTabs.Root>,
    "onValueChange" | "value"
  > & {
    defaultValue?: Value | null;
    onValueChange?: (value: Value | null, eventDetails: TabsChangeEventDetails) => void;
    value?: Value | null | undefined;
  };
</script>

<script lang="ts" generics="Value = TabsValue">
  import {
    Tabs as TabsPrimitive,
    type TabsActivationDirection,
    type TabsValue as ShardsTabsValue,
  } from "@shardsui/svelte/tabs";
  import { untrack } from "svelte";
  import { cn } from "@/utils.js";
  import { type TabsAdapterTab, setTabsRootAdapterContext } from "./context.js";
  import {
    createTabsChangeEventDetails,
    type TabsChangeEventReason,
  } from "./tabs-change-details.js";

  let {
    class: className,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: TabsRootProps<Value> = $props();

  const hasExplicitDefaultValue = untrack(() => defaultValue !== undefined);
  const initialValue = untrack<Value | null>(() =>
    defaultValue === undefined ? (0 as Value) : defaultValue,
  );
  const isControlled = untrack(() => value !== undefined);
  let internalValue = $state<Value | null>(initialValue);
  const registeredTabs = new Map<HTMLElement, TabsAdapterTab>();
  let registryVersion = $state(0);
  let recordedEvent: Event | undefined;
  let pendingUserChange: { readonly canceled: boolean; readonly value: Value | null } | undefined;
  let shouldNotifyInitialValueChange = !hasExplicitDefaultValue;
  let shouldHonorDisabledDefaultValue = hasExplicitDefaultValue;
  let didRegisterTabs = false;

  const selectedValue = $derived(isControlled ? (value as Value | null) : internalValue);

  function orderedTabs(): TabsAdapterTab[] {
    registryVersion;
    return Array.from(registeredTabs.values())
      .filter((tab) => tab.element.isConnected)
      .toSorted((left, right) => {
        const position = left.element.compareDocumentPosition(right.element);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
  }

  function currentTab(currentValue: TabsValue | undefined): TabsAdapterTab | undefined {
    registryVersion;
    return Array.from(registeredTabs.values()).find(
      (tab) => tab.element.isConnected && Object.is(tab.value, currentValue),
    );
  }

  function activationDirection(
    from: TabsValue | undefined,
    to: TabsValue,
  ): TabsActivationDirection {
    if (from == null || to == null) return "none";

    const fromTab = currentTab(from);
    const toTab = currentTab(to);
    if (!fromTab || !toTab) {
      if (typeof from !== typeof to || !["number", "string"].includes(typeof from)) {
        return "none";
      }
      if (orientation === "vertical") return to > from ? "down" : "up";
      return to > from ? "right" : "left";
    }

    const fromRect = fromTab.element.getBoundingClientRect();
    const toRect = toTab.element.getBoundingClientRect();
    if (orientation === "vertical") {
      if (toRect.top < fromRect.top) return "up";
      if (toRect.top > fromRect.top) return "down";
    } else {
      if (toRect.left < fromRect.left) return "left";
      if (toRect.left > fromRect.left) return "right";
    }
    return "none";
  }

  const tabsAdapter = setTabsRootAdapterContext({
    activationDirection,
    consumeEvent() {
      const event = recordedEvent;
      recordedEvent = undefined;
      return event;
    },
    currentTab,
    enabledTabs() {
      return orderedTabs().filter((tab) => !tab.disabled);
    },
    recordEvent(event) {
      recordedEvent = event;
      queueMicrotask(() => {
        if (recordedEvent === event) recordedEvent = undefined;
      });
    },
    registerTab(tab) {
      registeredTabs.set(tab.element, tab);
      registryVersion = untrack(() => registryVersion) + 1;
      return () => {
        if (registeredTabs.get(tab.element) !== tab) return;
        registeredTabs.delete(tab.element);
        registryVersion = untrack(() => registryVersion) + 1;
      };
    },
    get version() {
      return registryVersion;
    },
  });

  function commitValue(next: Value | null): void {
    if (!isControlled) internalValue = next;
    value = next;
  }

  function notifyAutomaticValueChange(
    next: Value | null,
    reason: Exclude<TabsChangeEventReason, "none">,
  ): void {
    commitValue(next);
    onValueChange?.(next, createTabsChangeEventDetails(reason, "none", undefined, undefined));
  }

  function getValue(): ShardsTabsValue {
    return selectedValue as ShardsTabsValue;
  }

  function setValue(next: ShardsTabsValue): void {
    const typedNext = next as Value | null;
    if (pendingUserChange && Object.is(pendingUserChange.value, typedNext)) {
      const { canceled } = pendingUserChange;
      pendingUserChange = undefined;
      if (canceled) return;
    }
    commitValue(typedNext);
  }

  function handleValueChange(next: ShardsTabsValue): void {
    const typedNext = next as Value | null;
    const event = tabsAdapter.consumeEvent();
    const trigger = event?.currentTarget instanceof Element ? event.currentTarget : undefined;
    const details = createTabsChangeEventDetails(
      "none",
      activationDirection(selectedValue, typedNext),
      event,
      trigger,
    );
    onValueChange?.(typedNext, details);
    pendingUserChange = { canceled: details.isCanceled, value: typedNext };
  }

  $effect(() => {
    tabsAdapter.version;
    if (isControlled) return;

    const tabs = orderedTabs();
    if (tabs.length === 0) {
      if (didRegisterTabs && selectedValue !== null) {
        shouldNotifyInitialValueChange = false;
        shouldHonorDisabledDefaultValue = false;
        notifyAutomaticValueChange(null, "missing");
      }
      return;
    }

    didRegisterTabs = true;
    const selectedTab = currentTab(selectedValue);
    const selectionIsDisabled = selectedTab?.disabled === true;
    const selectionIsMissing = selectedTab === undefined && selectedValue !== null;

    if (!selectionIsDisabled && Object.is(selectedValue, initialValue)) {
      shouldHonorDisabledDefaultValue = false;
    }
    if (
      shouldHonorDisabledDefaultValue &&
      selectionIsDisabled &&
      Object.is(selectedValue, initialValue)
    ) {
      return;
    }

    if (selectionIsDisabled || selectionIsMissing) {
      const fallback = (tabs.find((tab) => !tab.disabled)?.value ?? null) as Value | null;
      if (Object.is(selectedValue, fallback)) {
        shouldNotifyInitialValueChange = false;
        return;
      }

      const reason = shouldNotifyInitialValueChange
        ? "initial"
        : selectionIsDisabled
          ? "disabled"
          : "missing";
      shouldNotifyInitialValueChange = false;
      shouldHonorDisabledDefaultValue = false;
      notifyAutomaticValueChange(fallback, reason);
      return;
    }

    if (shouldNotifyInitialValueChange && selectedTab) {
      shouldNotifyInitialValueChange = false;
      onValueChange?.(
        selectedValue,
        createTabsChangeEventDetails("initial", "none", undefined, undefined),
      );
    }
  });
</script>

<TabsPrimitive.Root
  bind:ref
  bind:value={getValue, setValue}
  class={cn("flex flex-col gap-2 data-[orientation=vertical]:flex-row", className)}
  data-slot="tabs"
  onValueChange={handleValueChange}
  {orientation}
  {...props}
/>
