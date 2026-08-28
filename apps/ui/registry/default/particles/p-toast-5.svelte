<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

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

  function run() {
    void Toast.toastManager
      .promise(
        new Promise((resolve, reject) =>
          setTimeout(
            () =>
              Math.random() > 0.3
                ? resolve("Data loaded successfully")
                : reject(new Error("Failed to load data")),
            2000,
          ),
        ),
        {
          loading: { description: "The promise is loading.", title: "Loading…" },
          success: (data) => ({
            description: `Success: ${data}`,
            title: "This is a success toast!",
          }),
          error: { description: "Please try again.", title: "Something went wrong" },
        },
      )
      .catch(() => undefined);
  }
</script>

<Toast.Provider><Button onclick={run} variant="outline">Run Promise</Button></Toast.Provider>
