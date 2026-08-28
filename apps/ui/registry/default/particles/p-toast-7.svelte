<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast", "tooltip"],
    id: "p-toast-7",
    interactive: true,
    responsive: false,
    title: "Copy button with anchored toast",
  });
</script>

<script lang="ts">
  import { buttonVariants, Toast, Tooltip } from "@coss-sv/ui";
  import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  let button = $state<HTMLButtonElement | null>(null);
  let copied = $state(false);
  async function copy() {
    if (!button) return;
    try {
      await navigator.clipboard.writeText("https://coss.com");
    } catch {}
    copied = true;
    Toast.anchoredToastManager.add({
      data: { tooltipStyle: true },
      positionerProps: { anchor: button },
      timeout: 2000,
      title: "Copied!",
    });
    setTimeout(() => (copied = false), 2000);
  }
</script>

<Toast.AnchoredProvider
  ><Tooltip.Provider delay={0}
    ><Tooltip.Root
      ><Tooltip.Trigger
        aria-label="Copy link"
        bind:ref={button}
        class={buttonVariants({ size: "icon", variant: "outline" })}
        disabled={copied}
        onclick={copy}
        ><HugeiconsIcon
          aria-hidden="true"
          class="size-4"
          icon={copied ? Tick01Icon : Copy01Icon}
          strokeWidth={2}
        /></Tooltip.Trigger
      ><Tooltip.Popup><p>Copy to clipboard</p></Tooltip.Popup></Tooltip.Root
    ></Tooltip.Provider
  ></Toast.AnchoredProvider
>
