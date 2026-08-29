<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "toast", "tooltip"],
    id: "p-toast-12",
    interactive: true,
    responsive: false,
    title: "Anchored save toast",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, Toast, Tooltip } from "@coss-sv/ui";
  import { FloppyDiskIcon } from "@hugeicons/core-free-icons";

  let button = $state<HTMLButtonElement | null>(null);
  function save() {
    if (!button) return;
    Toast.anchoredToastManager.add({
      data: { tooltipStyle: true },
      id: "coss-demo-anchored-save-toast",
      positionerProps: { anchor: button, sideOffset: 6 },
      timeout: 2000,
      title: "Draft saved",
    });
  }
</script>

<Toast.AnchoredProvider
  ><Tooltip.Provider
    ><Tooltip.Root
      ><Tooltip.Trigger
        aria-label="Save"
        bind:ref={button}
        class={buttonVariants({ size: "icon", variant: "outline" })}
        delay={0}
        onclick={save}
        type="button"
        ><HugeiconsIcon aria-hidden="true" icon={FloppyDiskIcon} strokeWidth={2} /></Tooltip.Trigger
      ><Tooltip.Popup><p>Save</p></Tooltip.Popup></Tooltip.Root
    ></Tooltip.Provider
  ></Toast.AnchoredProvider
>
