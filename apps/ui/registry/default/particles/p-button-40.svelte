<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "group", "spinner", "toast", "tooltip"],
    id: "p-button-40",
    interactive: true,
    responsive: false,
    title: "Download progress button",
  });
</script>

<script lang="ts">
  import {
    Button,
    buttonVariants,
    Group,
    Spinner,
    Toast,
    Tooltip,
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import { Cancel01Icon, Download01Icon } from "@hugeicons/core-free-icons";

  let downloading = $state(false);
  let progress = $state(0);
  let abortController: AbortController | null = null;
  let infoToastId: string | null = null;

  $effect(() => {
    if (!downloading) return;
    const interval = window.setInterval(() => {
      progress = Math.min(99, progress + Math.round(Math.random() * 8 + 2));
    }, 300);
    return () => window.clearInterval(interval);
  });

  async function start() {
    if (downloading) return;
    downloading = true;
    progress = 0;
    abortController = new AbortController();
    infoToastId = Toast.toastManager.add({
      description: "Your download will begin once ready.",
      title: "Generating report…",
      type: "info",
    });

    try {
      await new Promise<void>((resolve, reject) => {
        const shouldSucceed = Math.random() > 0.2;
        const timeout = window.setTimeout(
          () => (shouldSucceed ? resolve() : reject(new Error("Download failed"))),
          4000,
        );
        abortController?.signal.addEventListener(
          "abort",
          () => {
            window.clearTimeout(timeout);
            reject(new DOMException("Cancelled", "AbortError"));
          },
          { once: true },
        );
      });
    } catch (error) {
      if (infoToastId) Toast.toastManager.close(infoToastId);
      infoToastId = null;
      Toast.toastManager.add(
        error instanceof DOMException && error.name === "AbortError"
          ? {
              description: "Report generation was cancelled.",
              title: "Cancelled",
              type: "error",
            }
          : {
              description: "Please try again later.",
              title: "Failed to generate report",
              type: "error",
            },
      );
    } finally {
      downloading = false;
      progress = 0;
      abortController = null;
      infoToastId = null;
    }
  }

  function cancel() {
    abortController?.abort();
  }
</script>

<Toast.Provider>
  <Tooltip.Provider delay={0}>
    {#if downloading}
      <Group.Root>
        <Group.Text aria-live="polite" class="cursor-default gap-2" role="status">
          <Spinner />
          <span aria-hidden="true" class="font-medium text-foreground tabular-nums">
            {String(progress).padStart(2, "\u2007")}%
          </span>
          <span class="sr-only">Generating report, {progress}% complete</span>
        </Group.Text>
        <Group.Separator />
        <Tooltip.Root>
          <Tooltip.Trigger
            aria-label="Cancel download"
            class={buttonVariants({ size: "icon", variant: "outline" })}
            onclick={cancel}
          >
            <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
          </Tooltip.Trigger>
          <Tooltip.Popup>Cancel</Tooltip.Popup>
        </Tooltip.Root>
      </Group.Root>
    {:else}
      <Button onclick={() => void start()} variant="outline">
        <HugeiconsIcon aria-hidden="true" icon={Download01Icon} strokeWidth={2} />
        Download
      </Button>
    {/if}
  </Tooltip.Provider>
</Toast.Provider>
