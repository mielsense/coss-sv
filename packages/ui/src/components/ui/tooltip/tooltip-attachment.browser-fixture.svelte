<script lang="ts">
  import * as Tooltip from "./index.js";
  import * as ToggleGroup from "../toggle-group/index.js";
  import * as Toolbar from "../toolbar/index.js";

  const focusHandle = Tooltip.TooltipCreateHandle<string>();
  const persistentHandle = Tooltip.TooltipCreateHandle();
  const disabledHandle = Tooltip.TooltipCreateHandle();
  const cleanupHandle = Tooltip.TooltipCreateHandle();
  const composedHandle = Tooltip.TooltipCreateHandle();
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
  let showCleanupTarget = $state(true);
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
