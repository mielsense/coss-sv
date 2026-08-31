<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast"],
    id: "p-toast-5",
    interactive: true,
    responsive: false,
    title: "Promise toast",
  });
</script>

<script lang="ts">
  import { Button, Toast } from "@coss-sv/ui";
  import { onDestroy } from "svelte";

  const toastManager = new Toast.Manager();
  let controller: AbortController | null = null;

  onDestroy(() => controller?.abort());

  function run() {
    controller?.abort();
    controller = new AbortController();
    const activeController = controller;

    void toastManager
      .promise(
        new Promise((resolve, reject) => {
          const timer = setTimeout(
            () =>
              Math.random() > 0.3
                ? resolve("Data loaded successfully")
                : reject(new Error("Failed to load data")),
            2000,
          );
          activeController.signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new DOMException("Cancelled", "AbortError"));
            },
            { once: true },
          );
        }),
        {
          loading: { description: "The promise is loading.", title: "Loading…" },
          success: (data) => ({
            description: `Success: ${data}`,
            title: "This is a success toast!",
          }),
          error: { description: "Please try again.", title: "Something went wrong" },
        },
      )
      .catch(() => undefined)
      .finally(() => {
        if (controller === activeController) controller = null;
      });
  }
</script>

<Toast.Provider {toastManager}>
  <Button onclick={run} variant="outline">Run Promise</Button>
</Toast.Provider>
