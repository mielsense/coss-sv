<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-9",
    interactive: true,
    responsive: false,
    title: "Download promise toast",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";
  import { Download01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  let generating = $state(false);
  let progress = $state(0);
  async function download() {
    if (generating) return;
    generating = true;
    const controller = new AbortController();
    const interval = setInterval(
      () => (progress = Math.min(99, progress + Math.round(Math.random() * 8 + 2))),
      300,
    );
    try {
      await Toast.toastManager.promise(
        new Promise((resolve, reject) => {
          const timer = setTimeout(
            () =>
              Math.random() > 0.2
                ? resolve("Report ready")
                : reject(new Error("Generation failed")),
            4000,
          );
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("Cancelled", "AbortError"));
          });
        }),
        {
          loading: {
            actionProps: { children: "Cancel", onclick: () => controller.abort() },
            description: "Your download will begin once ready.",
            title: "Generating report…",
          },
          success: { description: "Your file is now downloading.", title: "Download started" },
          error: (error) =>
            error instanceof Error && error.name === "AbortError"
              ? {
                  description: "Report generation was cancelled.",
                  title: "Cancelled",
                  type: "info",
                }
              : { description: "Please try again later.", title: "Failed to generate report" },
        },
      );
    } catch {
    } finally {
      clearInterval(interval);
      generating = false;
      progress = 0;
    }
  }
</script>

<Toast.Provider
  ><Button disabled={generating} onclick={download} variant="outline"
    >{#if generating}Loading… <span class="tabular-nums"
        >{progress.toString().padStart(2, " ")}%</span
      >{:else}<HugeiconsIcon
        aria-hidden="true"
        icon={Download01Icon}
        strokeWidth={2}
      />Download{/if}</Button
  ></Toast.Provider
>
