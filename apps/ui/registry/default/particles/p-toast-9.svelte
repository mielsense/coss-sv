<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-9",
    interactive: true,
    responsive: false,
    title: "Download promise toast",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon, Toast } from "@coss-sv/ui";
  import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";

  const toastManager = new Toast.Manager();
  let generating = $state(false);
  let progress = $state(0);
  let controller: AbortController | null = null;

  $effect(() => {
    if (!generating) return;
    const interval = setInterval(
      () => (progress = Math.min(99, progress + Math.round(Math.random() * 8 + 2))),
      300,
    );
    return () => clearInterval(interval);
  });

  $effect(() => () => controller?.abort());

  async function download() {
    if (generating) return;
    generating = true;
    progress = 0;
    controller = new AbortController();
    const activeController = controller;
    try {
      await toastManager.promise(
        new Promise((resolve, reject) => {
          const shouldSucceed = Math.random() > 0.2;
          const timer = setTimeout(
            () =>
              shouldSucceed ? resolve("Report ready") : reject(new Error("Generation failed")),
            4000,
          );
          activeController.signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("Cancelled", "AbortError"));
          });
        }),
        {
          loading: {
            actionProps: { children: "Cancel", onclick: () => activeController.abort() },
            description: "Your download will begin once ready.",
            title: "Generating report…",
          },
          success: {
            actionProps: undefined,
            description: "Your file is now downloading.",
            title: "Download started",
          },
          error: (error) =>
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
        },
      );
    } catch {
    } finally {
      generating = false;
      progress = 0;
      if (controller === activeController) controller = null;
    }
  }
</script>

<Toast.Provider {toastManager}>
  <Button disabled={generating} onclick={download} variant="outline">
    {#if generating}Loading… <span class="tabular-nums">
        {progress.toString().padStart(2, " ")}%
      </span>{:else}<HugeiconsIcon
        aria-hidden="true"
        icon={Download01Icon}
        strokeWidth={2}
      />Download{/if}
  </Button>
</Toast.Provider>
