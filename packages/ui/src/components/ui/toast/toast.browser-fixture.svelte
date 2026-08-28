<script lang="ts">
import * as Toast from "./index.js";

let { position = "bottom-right" }: { position?: Toast.ToastPosition } = $props();
const manager = new Toast.Manager<{ source?: string }>();
const anchoredManager = new Toast.Manager<Toast.ToastData>();
let anchor = $state<HTMLButtonElement | null>(null);
let resolvePromise: ((value: string) => void) | undefined;
let rejectPromise: ((reason: Error) => void) | undefined;
let actionCount = $state(0);

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

<Toast.Provider limit={3} {position} toastManager={manager}>
  <button data-testid="add-default" onclick={addDefault} type="button">Add default</button>
  <button data-testid="add-action" onclick={addAction} type="button">Add action</button>
  <button data-testid="add-timed" onclick={addTimed} type="button">Add timed</button>
  <button data-testid="start-promise" onclick={startPromise} type="button">Start promise</button>
  <button data-testid="resolve" onclick={() => resolvePromise?.("Complete")} type="button">
    Resolve
  </button>
  <button data-testid="reject" onclick={() => rejectPromise?.(new Error("Nope"))} type="button">
    Reject
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

<Toast.AnchoredProvider toastManager={anchoredManager}>
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
