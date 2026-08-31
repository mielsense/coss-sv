<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast", "tooltip"],
    id: "p-toast-7",
    interactive: true,
    responsive: false,
    title: "Copy button with anchored toast",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, Toast, Tooltip } from "@coss-sv/ui";
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Tick01Icon from "@hugeicons/core-free-icons/Tick01Icon";
  import { onDestroy } from "svelte";

  const toastManager = new Toast.Manager();
  let button = $state<HTMLButtonElement | null>(null);
  let copied = $state(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    if (!button || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText("https://coss.com");
    } catch {
      return;
    }
    copied = true;
    toastManager.add({
      data: { tooltipStyle: true },
      positionerProps: { anchor: button },
      timeout: 2000,
      title: "Copied!",
    });
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied = false), 2000);
  }

  onDestroy(() => {
    if (resetTimer) clearTimeout(resetTimer);
  });
</script>

<Toast.AnchoredProvider {toastManager}>
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="Copy link"
        bind:ref={button}
        class={buttonVariants({ size: "icon", variant: "outline" })}
        disabled={copied}
        onclick={copy}
        type="button"
      >
        <HugeiconsIcon
          aria-hidden="true"
          class="size-4"
          icon={copied ? Tick01Icon : Copy01Icon}
          strokeWidth={2}
        />
      </Tooltip.Trigger><Tooltip.Popup><p>Copy to clipboard</p></Tooltip.Popup>
    </Tooltip.Root>
  </Tooltip.Provider>
</Toast.AnchoredProvider>
