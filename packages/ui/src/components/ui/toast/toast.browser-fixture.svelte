<script lang="ts">
import * as Toast from "./index.js";

let {
  anchoredPortalRef,
  onPortalClick,
  portalTarget,
  position = "bottom-right",
  standardPortalRef,
  useContainerRefs = false,
}: {
  anchoredPortalRef?: Toast.ToastPortalRef;
  onPortalClick?: (event: MouseEvent) => void;
  portalTarget?: HTMLElement | ShadowRoot;
  position?: Toast.ToastPosition;
  standardPortalRef?: Toast.ToastPortalRef;
  useContainerRefs?: boolean;
} = $props();
const manager = new Toast.Manager<{ source?: string }>();
const anchoredManager = new Toast.Manager<Toast.ToastData>();
let anchor = $state<HTMLButtonElement | null>(null);
let resolvePromise: ((value: string) => void) | undefined;
let rejectPromise: ((reason: Error) => void) | undefined;
let actionCount = $state(0);
let resolveReport: (() => void) | undefined;
let rejectReport: ((reason: Error) => void) | undefined;
let standardContainerTarget = $state<HTMLDivElement | null>(null);
let anchoredContainerHost = $state<HTMLDivElement | null>(null);
const standardContainerRef = $state<Toast.ToastPortalContainerRef>({ current: null });
const anchoredContainerRef = $state<Toast.ToastPortalContainerRef>({ current: null });

function setContainerRefs(): void {
  standardContainerRef.current = standardContainerTarget;
  anchoredContainerRef.current =
    anchoredContainerHost?.shadowRoot ??
    anchoredContainerHost?.attachShadow({ mode: "open" }) ??
    null;
}

function clearContainerRefs(): void {
  standardContainerRef.current = null;
  anchoredContainerRef.current = null;
}

function addDefault(): void {
  manager.add({
    description: "Monday, January 3rd at 6:00pm",
    title: "Event has been created",
    timeout: 0,
  });
}

function addAction(): void {
  manager.add({
    actionProps: {
      children: "Undo",
      onclick: () => (actionCount += 1),
    },
    description: "You can undo this action.",
    title: "Action performed",
    timeout: 0,
    type: "success",
  });
}

function addTimed(): void {
  manager.add({ title: "Timed", timeout: 80 });
}

function addHighPriority(): void {
  manager.add({ priority: "high", title: "Payment failed", timeout: 0, type: "error" });
}

function startReport(): void {
  const controller = new AbortController();
  const promise = new Promise<void>((resolve, reject) => {
    resolveReport = resolve;
    rejectReport = reject;
    controller.signal.addEventListener("abort", () => reject(controller.signal.reason), {
      once: true,
    });
  });

  manager
    .promise(promise, {
      error: (error) => ({
        actionProps: undefined,
        description: error instanceof Error ? error.message : "Unknown error",
        title:
          error instanceof DOMException && error.name === "AbortError" ? "Cancelled" : "Failed",
        type: error instanceof DOMException && error.name === "AbortError" ? "info" : "error",
      }),
      loading: {
        actionProps: { children: "Cancel", onclick: () => controller.abort() },
        title: "Generating report…",
      },
      success: { actionProps: undefined, title: "Report generated", type: "success" },
    })
    .catch(() => undefined);
}

function startPromise(): void {
  const promise = new Promise<string>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  manager
    .promise(promise, {
      error: (error) => ({ description: String(error), title: "Failed", type: "error" }),
      loading: { description: "Waiting", title: "Loading…" },
      success: (value) => ({ description: value, title: "Saved", type: "success" }),
    })
    .catch(() => undefined);
}

function addAnchored(tooltipStyle = false): void {
  if (!anchor) return;
  anchoredManager.add({
    data: { tooltipStyle },
    positionerProps: { anchor },
    title: tooltipStyle ? "Copied!" : "Anchored",
    timeout: 0,
    ...(tooltipStyle ? {} : { type: "info" }),
  });
}
</script>

<Toast.Provider
  portalProps={{
    "aria-label": "Toast portal",
    class: "custom-toast-portal",
    container: useContainerRefs ? standardContainerRef : portalTarget,
    "data-portal": "custom",
    id: "toast-portal-probe",
    onclick: onPortalClick,
    ref: standardPortalRef,
    style: "--portal-marker: 37",
  }}
  limit={3}
  {position}
  toastManager={manager}
>
  <button data-testid="add-default" onclick={addDefault} type="button">Add default</button>
  <button data-testid="add-action" onclick={addAction} type="button">Add action</button>
  <button data-testid="add-timed" onclick={addTimed} type="button">Add timed</button>
  <button data-testid="add-high" onclick={addHighPriority} type="button">Add high</button>
  <button data-testid="start-promise" onclick={startPromise} type="button">Start promise</button>
  <button data-testid="resolve" onclick={() => resolvePromise?.("Complete")} type="button">
    Resolve
  </button>
  <button data-testid="reject" onclick={() => rejectPromise?.(new Error("Nope"))} type="button">
    Reject
  </button>
  <button data-testid="start-report" onclick={startReport} type="button">Start report</button>
  <button data-testid="resolve-report" onclick={() => resolveReport?.()} type="button">
    Resolve report
  </button>
  <button
    data-testid="reject-report"
    onclick={() => rejectReport?.(new Error("Generation failed"))}
    type="button"
  >
    Reject report
  </button>
  <button
    data-testid="upsert-success"
    onclick={() => manager.add({ id: "stable", title: "Stable success", timeout: 0 })}
    type="button"
  >
    Upsert success
  </button>
  <button
    data-testid="upsert-error"
    onclick={() => manager.add({ id: "stable-error", title: "Stable error", timeout: 0, type: "error" })}
    type="button"
  >
    Upsert error
  </button>
  <button data-testid="close-all" onclick={() => manager.close()} type="button">Close all</button>
</Toast.Provider>

<Toast.AnchoredProvider
  portalProps={{
    container: useContainerRefs ? anchoredContainerRef : undefined,
    id: "anchored-toast-portal-probe",
    ref: anchoredPortalRef,
  }}
  toastManager={anchoredManager}
>
  <button bind:this={anchor} data-testid="anchor" style="margin-top: 6rem" type="button">
    Anchor
  </button>
  <button data-testid="add-anchored" onclick={() => addAnchored()} type="button">
    Add anchored
  </button>
  <button data-testid="add-tooltip" onclick={() => addAnchored(true)} type="button">
    Add tooltip
  </button>
</Toast.AnchoredProvider>

<output data-testid="action-count">{actionCount}</output>

{#if useContainerRefs}
  <div bind:this={standardContainerTarget} data-testid="standard-container-ref-target"></div>
  <div bind:this={anchoredContainerHost} data-testid="anchored-container-ref-host"></div>
  <button data-testid="set-container-refs" onclick={setContainerRefs} type="button">
    Set container refs
  </button>
  <button data-testid="clear-container-refs" onclick={clearContainerRefs} type="button">
    Clear container refs
  </button>
{/if}
