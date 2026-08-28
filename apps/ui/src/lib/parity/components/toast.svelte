<script lang="ts">
import { Button, buttonVariants, Spinner, Toast, Tooltip } from "@coss-sv/ui";
import { onDestroy } from "svelte";

const texts = [
  "Short message.",
  "A bit longer message that spans two lines.",
  "This is a longer description that intentionally takes more vertical space to demonstrate stacking with varying heights.",
  "An even longer description that should span multiple lines so we can verify the clamped collapsed height and smooth expansion animation when hovering or focusing the viewport.",
];

let copyButton = $state<HTMLButtonElement | null>(null);
let submitButton = $state<HTMLButtonElement | null>(null);
let successSaveButton = $state<HTMLButtonElement | null>(null);
let errorSaveButton = $state<HTMLButtonElement | null>(null);
let copied = $state(false);
let submitting = $state(false);
let generating = $state(false);
let progress = $state(0);
let varyingCount = $state(0);
let submitToastId: string | null = null;
let abortController: AbortController | null = null;
let copyTimeout: ReturnType<typeof setTimeout> | undefined;
let progressInterval: ReturnType<typeof setInterval> | undefined;

onDestroy(() => {
  if (copyTimeout) clearTimeout(copyTimeout);
  if (progressInterval) clearInterval(progressInterval);
  abortController?.abort();
});

function addStatus(type: "success" | "error" | "info" | "warning"): void {
  const content = {
    success: ["Success!", "Your changes have been saved."],
    error: ["Uh oh! Something went wrong.", "There was a problem with your request."],
    info: ["Heads up!", "You can add components to your app using the cli."],
    warning: ["Warning!", "Your session is about to expire."],
  } as const;
  Toast.toastManager.add({ title: content[type][0], description: content[type][1], type });
}

function performAction(): void {
  const id = Toast.toastManager.add({
    actionProps: {
      children: "Undo",
      onclick: () => {
        Toast.toastManager.close(id);
        Toast.toastManager.add({
          description: "The action has been reverted.",
          title: "Action undone",
          type: "info",
        });
      },
    },
    description: "You can undo this action.",
    timeout: 1000000,
    title: "Action performed",
    type: "success",
  });
}

function runPromise(): void {
  Toast.toastManager
    .promise(
      new Promise<string>((resolve, reject) => {
        const shouldSucceed = Math.random() > 0.3;
        setTimeout(() => {
          if (shouldSucceed) resolve("Data loaded successfully");
          else reject(new Error("Failed to load data"));
        }, 2000);
      }),
      {
        error: () => ({ description: "Please try again.", title: "Something went wrong" }),
        loading: { description: "The promise is loading.", title: "Loading…" },
        success: (data: string) => ({
          description: `Success: ${data}`,
          title: "This is a success toast!",
        }),
      },
    )
    .catch(() => undefined);
}

function varyingHeight(): void {
  varyingCount += 1;
  Toast.toastManager.add({
    description: texts[Math.floor(Math.random() * texts.length)] ?? "Short message.",
    title: `Toast ${varyingCount} created`,
  });
}

async function copyLink(): Promise<void> {
  if (!copyButton) return;
  try {
    await navigator.clipboard.writeText("https://coss.com");
  } catch {
    return;
  }
  copied = true;
  Toast.anchoredToastManager.add({
    data: { tooltipStyle: true },
    positionerProps: { anchor: copyButton },
    timeout: 2000,
    title: "Copied!",
  });
  if (copyTimeout) clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => {
    copied = false;
    copyTimeout = undefined;
  }, 2000);
}

function submit(): void {
  if (!submitButton || submitting) return;
  if (submitToastId) Toast.anchoredToastManager.close(submitToastId);
  submitting = true;
  setTimeout(() => {
    submitting = false;
    if (!submitButton) return;
    submitToastId = Toast.anchoredToastManager.add({
      description: "The server is not responding. Please try again later.",
      positionerProps: { anchor: submitButton, sideOffset: 4 },
      title: "Error submitting form",
      type: "error",
    });
  }, 2000);
}

async function download(): Promise<void> {
  if (generating) return;
  generating = true;
  progress = 0;
  abortController = new AbortController();
  progressInterval = setInterval(() => {
    progress = Math.min(99, progress + Math.round(Math.random() * 8 + 2));
  }, 300);

  try {
    await Toast.toastManager.promise(
      new Promise<string>((resolve, reject) => {
        const shouldSucceed = Math.random() > 0.2;
        const timeoutId = setTimeout(
          () => (shouldSucceed ? resolve("Report ready") : reject(new Error("Generation failed"))),
          4000,
        );
        abortController?.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject(new DOMException("Cancelled", "AbortError"));
        });
      }),
      {
        error: (error: unknown) =>
          error instanceof Error && error.name === "AbortError"
            ? {
                actionProps: undefined,
                description: "Report generation was cancelled.",
                title: "Cancelled",
                type: "info",
              }
            : {
                actionProps: undefined,
                description: "Please try again later.",
                title: "Failed to generate report",
              },
        loading: {
          actionProps: { children: "Cancel", onclick: () => abortController?.abort() },
          description: "Your download will begin once ready.",
          title: "Generating report…",
        },
        success: () => ({
          actionProps: undefined,
          description: "Your file is now downloading.",
          title: "Download started",
        }),
      },
    );
  } catch {
    // The toast manager renders the cancellation and error states.
  } finally {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = undefined;
    generating = false;
    progress = 0;
    abortController = null;
  }
}

function saveTooltip(anchor: HTMLButtonElement | null, error = false): void {
  if (!anchor) return;
  Toast.anchoredToastManager.add({
    data: { tooltipStyle: true },
    id: error ? "coss-demo-anchored-save-error-toast" : "coss-demo-anchored-save-toast",
    positionerProps: { anchor, sideOffset: 6 },
    timeout: 2000,
    title: error ? "Couldn't save draft" : "Draft saved",
    ...(error ? { type: "error" } : {}),
  });
}
</script>

<Toast.Provider>
  <Toast.AnchoredProvider>
    <div class="fixture">
      <section data-particle="p-toast-1">
        <Button
          onclick={() =>
            Toast.toastManager.add({
              description: "Monday, January 3rd at 6:00pm",
              title: "Event has been created",
            })}
          variant="outline"
          >Default Toast</Button
        >
      </section>
      <section data-particle="p-toast-2">
        <div class="flex flex-wrap items-center justify-center gap-2">
          <Button onclick={() => addStatus("success")} variant="outline">Success Toast</Button>
          <Button onclick={() => addStatus("error")} variant="outline">Error Toast</Button>
          <Button onclick={() => addStatus("info")} variant="outline">Info Toast</Button>
          <Button onclick={() => addStatus("warning")} variant="outline">Warning Toast</Button>
        </div>
      </section>
      <section data-particle="p-toast-3">
        <Button
          onclick={() =>
            Toast.toastManager.add({
              description: "Please wait while we process your request.",
              title: "Loading…",
              type: "loading",
            })}
          variant="outline"
          >Loading Toast</Button
        >
      </section>
      <section data-particle="p-toast-4">
        <Button onclick={performAction} variant="outline">Perform Action</Button>
      </section>
      <section data-particle="p-toast-5">
        <Button onclick={runPromise} variant="outline">Run Promise</Button>
      </section>
      <section data-particle="p-toast-6">
        <Button onclick={varyingHeight} variant="outline">With Varying Heights</Button>
      </section>
      <section data-particle="p-toast-7">
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Copy link"
            bind:ref={copyButton}
            class={buttonVariants({ size: "icon", variant: "outline" })}
            disabled={copied}
            onclick={copyLink}
            type="button"
          >
            {#if copied}
              {@render checkIcon("size-4")}
            {:else}
              {@render copyIcon("size-4")}
            {/if}
          </Tooltip.Trigger>
          <Tooltip.Popup><p>Copy to clipboard</p></Tooltip.Popup>
        </Tooltip.Root>
      </section>
      <section data-particle="p-toast-8">
        <Button bind:ref={submitButton} disabled={submitting} onclick={submit} variant="outline">
          {#if submitting}
            <Spinner />
            Submitting…
          {:else}
            Submit
          {/if}
        </Button>
      </section>
      <section data-particle="p-toast-9">
        <Button disabled={generating} onclick={download} variant="outline">
          {#if generating}
            Loading… <span class="tabular-nums">{progress.toString().padStart(2, " ")}%</span>
          {:else}
            {@render downloadIcon()}
            Download
          {/if}
        </Button>
      </section>
      <section data-particle="p-toast-10">
        <Button
          onclick={() =>
            Toast.toastManager.add({
              description: "Repeated clicks update this toast instead of stacking another.",
              id: "coss-demo-dedup-toast",
              title: "Saved",
              type: "success",
            })}
          variant="outline"
          >One Success Toast</Button
        >
      </section>
      <section data-particle="p-toast-11">
        <Button
          onclick={() =>
            Toast.toastManager.add({
              description: "Repeated clicks update this toast; errors use a shake animation.",
              id: "coss-demo-error-upsert",
              title: "Something went wrong",
              type: "error",
            })}
          variant="outline"
          >One Error Toast</Button
        >
      </section>
      <section data-particle="p-toast-12">
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Save"
            bind:ref={successSaveButton}
            class={buttonVariants({ size: "icon", variant: "outline" })}
            delay={0}
            onclick={() => saveTooltip(successSaveButton)}
            type="button"
          >
            {@render saveIcon()}
          </Tooltip.Trigger>
          <Tooltip.Popup><p>Save</p></Tooltip.Popup>
        </Tooltip.Root>
      </section>
      <section data-particle="p-toast-13">
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Save"
            bind:ref={errorSaveButton}
            class={buttonVariants({ size: "icon", variant: "outline" })}
            delay={0}
            onclick={() => saveTooltip(errorSaveButton, true)}
            type="button"
          >
            {@render saveIcon()}
          </Tooltip.Trigger>
          <Tooltip.Popup><p>Save</p></Tooltip.Popup>
        </Tooltip.Root>
      </section>
    </div>
  </Toast.AnchoredProvider>
</Toast.Provider>

{#snippet icon(paths: import("svelte").Snippet, className?: string)}
  <svg
    aria-hidden="true"
    class={className}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    {@render paths()}
  </svg>
{/snippet}
{#snippet checkIcon(className?: string)}
  {@render icon(checkPaths, className)}
{/snippet}
{#snippet checkPaths()}
  <path d="m20 6-11 11-5-5" />
{/snippet}
{#snippet copyIcon(className?: string)}
  {@render icon(copyPaths, className)}
{/snippet}
{#snippet copyPaths()}
  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
{/snippet}
{#snippet downloadIcon()}
  {@render icon(downloadPaths)}
{/snippet}
{#snippet downloadPaths()}
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  <polyline points="7 10 12 15 17 10" />
  <line x1="12" x2="12" y1="15" y2="3" />
{/snippet}
{#snippet saveIcon()}
  {@render icon(savePaths)}
{/snippet}
{#snippet savePaths()}
  <path
    d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
  />
  <path d="M17 21v-8H7v8" />
  <path d="M7 3v5h8" />
{/snippet}

<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 3rem;
  padding: 2rem;
}
.fixture > section {
  display: flex;
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}
</style>
