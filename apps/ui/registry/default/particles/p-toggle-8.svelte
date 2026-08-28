<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["toast", "toggle", "tooltip"],
  id: "p-toggle-8",
  interactive: true,
  responsive: false,
  title: "Bookmark toggle",
});
</script>

<script lang="ts">
import { Toast, Toggle, Tooltip } from "@coss-sv/ui";
import { Bookmark01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

let bookmarked = $state(false);
let anchor = $state<HTMLElement | null>(null);
let toastId: string | null = null;
let tooltipOpen = $state(false);
let hoverTimer: number | undefined;
const uid = $props.id();
const triggerId = `${uid}-trigger`;
const tooltipId = `${uid}-tooltip`;

function clearHoverTimer() {
  if (hoverTimer !== undefined) window.clearTimeout(hoverTimer);
  hoverTimer = undefined;
}

function openTooltip() {
  clearHoverTimer();
  tooltipOpen = true;
}

function openTooltipAfterDelay() {
  clearHoverTimer();
  hoverTimer = window.setTimeout(() => {
    tooltipOpen = true;
    hoverTimer = undefined;
  }, 600);
}

function closeTooltip() {
  clearHoverTimer();
  tooltipOpen = false;
}

$effect(() => () => clearHoverTimer());

function toggleBookmark(pressed: boolean) {
  bookmarked = pressed;
  if (toastId) Toast.anchoredToastManager.close(toastId);
  toastId = null;
  if (pressed && anchor) {
    toastId = Toast.anchoredToastManager.add({
      data: { tooltipStyle: true },
      positionerProps: { anchor },
      timeout: 2000,
      title: "Bookmarked!",
      type: "success",
    });
  }
}
</script>

<Toast.Provider>
  <Toast.AnchoredProvider>
    <Tooltip.Root bind:open={tooltipOpen} {triggerId}>
      <Toggle
        aria-describedby={tooltipId}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark this"}
        bind:ref={anchor}
        data-slot="tooltip-trigger"
        id={triggerId}
        onblur={closeTooltip}
        onclick={closeTooltip}
        onfocus={openTooltip}
        onmouseenter={openTooltipAfterDelay}
        onmouseleave={closeTooltip}
        onPressedChange={toggleBookmark}
        pressed={bookmarked}
      >
        <HugeiconsIcon aria-hidden="true" icon={Bookmark01Icon} strokeWidth={2} />
      </Toggle>
      <Tooltip.Popup {anchor} id={tooltipId}>
        {bookmarked ? "Remove bookmark" : "Bookmark this"}
      </Tooltip.Popup>
    </Tooltip.Root>
  </Toast.AnchoredProvider>
</Toast.Provider>
