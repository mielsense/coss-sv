<script lang="ts">
  import * as ToggleGroup from "../toggle-group/index.js";
  import * as Toolbar from "../toolbar/index.js";
  import * as Tooltip from "./index.js";

  const focusHandle = Tooltip.TooltipCreateHandle<string>();
  const persistentHandle = Tooltip.TooltipCreateHandle();
  const disabledHandle = Tooltip.TooltipCreateHandle();
  const cleanupHandle = Tooltip.TooltipCreateHandle();
  const composedHandle = Tooltip.TooltipCreateHandle();
  const groupedFirstHandle = Tooltip.TooltipCreateHandle();
  const groupedSecondHandle = Tooltip.TooltipCreateHandle();
  const isolatedHandle = Tooltip.TooltipCreateHandle();
  const transitHandle = Tooltip.TooltipCreateHandle();
  const nonHoverableTransitHandle = Tooltip.TooltipCreateHandle();
  const uid = $props.id();
  const focusId = `${uid}-focus`;
  const focusPopupId = `${uid}-focus-popup`;
  const persistentId = `${uid}-persistent`;
  const persistentPopupId = `${uid}-persistent-popup`;
  const disabledId = `${uid}-disabled`;
  const disabledPopupId = `${uid}-disabled-popup`;
  const cleanupId = `${uid}-cleanup`;
  const cleanupPopupId = `${uid}-cleanup-popup`;
  const composedId = `${uid}-composed`;
  const composedPopupId = `${uid}-composed-popup`;
  const groupedFirstId = `${uid}-grouped-first`;
  const groupedFirstPopupId = `${uid}-grouped-first-popup`;
  const groupedSecondId = `${uid}-grouped-second`;
  const groupedSecondPopupId = `${uid}-grouped-second-popup`;
  const isolatedId = `${uid}-isolated`;
  const isolatedPopupId = `${uid}-isolated-popup`;
  const transitId = `${uid}-transit`;
  const transitPopupId = `${uid}-transit-popup`;
  const nonHoverableTransitId = `${uid}-non-hoverable-transit`;
  const nonHoverableTransitPopupId = `${uid}-non-hoverable-transit-popup`;
  let showCleanupTarget = $state(true);
  let showGroupedFirst = $state(true);
  let cleanupResult = $state("idle");

  function openCleanupTarget(): void {
    try {
      cleanupHandle.open(cleanupId);
      cleanupResult = "opened";
    } catch {
      cleanupResult = "missing";
    }
  }
</script>

<Tooltip.Root handle={focusHandle}>
  <button
    {@attach Tooltip.createTriggerAttachment(focusHandle, () => ({
      ariaDescribedBy: focusPopupId,
      closeOnClick: true,
      delay: 0,
      id: focusId,
      payload: "focus-payload",
    }))}
    aria-describedby={focusPopupId}
    data-testid="attached-focus"
    id={focusId}
    type="button"
  >
    Attached focus
  </button>
  <Tooltip.Popup id={focusPopupId}>Attached hint</Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root handle={persistentHandle}>
  <button
    {@attach Tooltip.createTriggerAttachment(persistentHandle, () => ({
      ariaDescribedBy: persistentPopupId,
      closeOnClick: false,
      delay: 0,
      id: persistentId,
    }))}
    aria-describedby={persistentPopupId}
    data-testid="attached-persistent"
    id={persistentId}
    type="button"
  >
    Persistent trigger
  </button>
  <Tooltip.Popup id={persistentPopupId}>Persistent hint</Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root handle={disabledHandle}>
  <button
    {@attach Tooltip.createTriggerAttachment(disabledHandle, () => ({
      ariaDescribedBy: disabledPopupId,
      delay: 0,
      disabled: true,
      id: disabledId,
    }))}
    aria-describedby={disabledPopupId}
    data-testid="attached-disabled"
    id={disabledId}
    type="button"
  >
    Disabled trigger
  </button>
  <Tooltip.Popup id={disabledPopupId}>Disabled hint</Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root handle={cleanupHandle}>
  {#if showCleanupTarget}
    <button
      {@attach Tooltip.createTriggerAttachment(cleanupHandle, () => ({
        ariaDescribedBy: cleanupPopupId,
        delay: 0,
        id: cleanupId,
      }))}
      aria-describedby={cleanupPopupId}
      data-testid="attached-cleanup"
      id={cleanupId}
      type="button"
    >
      Cleanup trigger
    </button>
  {/if}
  <Tooltip.Popup id={cleanupPopupId}>Cleanup hint</Tooltip.Popup>
</Tooltip.Root>
<button
  data-testid="remove-attached-target"
  onclick={() => (showCleanupTarget = false)}
  type="button"
>
  Remove target
</button>
<button data-testid="open-removed-target" onclick={openCleanupTarget} type="button">
  Open removed target
</button>
<output data-testid="cleanup-result">{cleanupResult}</output>

<Toolbar.Root aria-label="Attached toolbar">
  <ToggleGroup.Root>
    <Tooltip.Root handle={composedHandle}>
      <ToggleGroup.Item
        {@attach Tooltip.createTriggerAttachment(composedHandle, () => ({
          ariaDescribedBy: composedPopupId,
          delay: 0,
          id: composedId,
        }))}
        aria-describedby={composedPopupId}
        aria-label="Composed toggle"
        data-testid="attached-composed"
        id={composedId}
        value="composed"
      >
        Composed
      </ToggleGroup.Item>
      <Tooltip.Popup id={composedPopupId}>Composed hint</Tooltip.Popup>
    </Tooltip.Root>
  </ToggleGroup.Root>
</Toolbar.Root>

<Tooltip.Provider delay={250} timeout={500}>
  {#if showGroupedFirst}
    <Tooltip.Root handle={groupedFirstHandle}>
      <button
        {@attach Tooltip.createTriggerAttachment(groupedFirstHandle, () => ({
          ariaDescribedBy: groupedFirstPopupId,
          id: groupedFirstId,
        }))}
        aria-describedby={groupedFirstPopupId}
        data-testid="attached-grouped-first"
        id={groupedFirstId}
        type="button"
      >
        Grouped first
      </button>
      <Tooltip.Popup id={groupedFirstPopupId}>Grouped first hint</Tooltip.Popup>
    </Tooltip.Root>
  {/if}
  <Tooltip.Root handle={groupedSecondHandle}>
    <button
      {@attach Tooltip.createTriggerAttachment(groupedSecondHandle, () => ({
        ariaDescribedBy: groupedSecondPopupId,
        id: groupedSecondId,
      }))}
      aria-describedby={groupedSecondPopupId}
      data-testid="attached-grouped-second"
      id={groupedSecondId}
      type="button"
    >
      Grouped second
    </button>
    <Tooltip.Popup id={groupedSecondPopupId}>Grouped second hint</Tooltip.Popup>
  </Tooltip.Root>
  <button
    data-testid="remove-grouped-first"
    onclick={() => (showGroupedFirst = false)}
    type="button"
  >
    Remove grouped first
  </button>
</Tooltip.Provider>

<Tooltip.Root handle={transitHandle}>
  <button
    {@attach Tooltip.createTriggerAttachment(transitHandle, () => ({
      ariaDescribedBy: transitPopupId,
      delay: 0,
      id: transitId,
    }))}
    aria-describedby={transitPopupId}
    data-testid="attached-transit"
    id={transitId}
    type="button"
  >
    Hoverable transit
  </button>
  <Tooltip.Popup id={transitPopupId} side="bottom" sideOffset={24}>Transit hint</Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root disableHoverablePopup handle={nonHoverableTransitHandle}>
  <button
    {@attach Tooltip.createTriggerAttachment(nonHoverableTransitHandle, () => ({
      ariaDescribedBy: nonHoverableTransitPopupId,
      delay: 0,
      id: nonHoverableTransitId,
    }))}
    aria-describedby={nonHoverableTransitPopupId}
    data-testid="attached-non-hoverable-transit"
    id={nonHoverableTransitId}
    type="button"
  >
    Non-hoverable transit
  </button>
  <Tooltip.Popup id={nonHoverableTransitPopupId} side="bottom" sideOffset={24}
    >Non-hoverable transit hint</Tooltip.Popup
  >
</Tooltip.Root>

<Tooltip.Provider delay={250} timeout={500}>
  <Tooltip.Root handle={isolatedHandle}>
    <button
      {@attach Tooltip.createTriggerAttachment(isolatedHandle, () => ({
        ariaDescribedBy: isolatedPopupId,
        id: isolatedId,
      }))}
      aria-describedby={isolatedPopupId}
      data-testid="attached-isolated"
      id={isolatedId}
      type="button"
    >
      Isolated trigger
    </button>
    <Tooltip.Popup id={isolatedPopupId}>Isolated hint</Tooltip.Popup>
  </Tooltip.Root>
</Tooltip.Provider>
