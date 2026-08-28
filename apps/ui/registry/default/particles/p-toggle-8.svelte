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
    <Tooltip.Root>
      <Tooltip.Trigger as="div" bind:ref={anchor}>
        <Toggle
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this"}
          onPressedChange={toggleBookmark}
          pressed={bookmarked}
        >
          <HugeiconsIcon aria-hidden="true" icon={Bookmark01Icon} strokeWidth={2} />
        </Toggle>
      </Tooltip.Trigger>
      <Tooltip.Popup>{bookmarked ? "Remove bookmark" : "Bookmark this"}</Tooltip.Popup>
    </Tooltip.Root>
  </Toast.AnchoredProvider>
</Toast.Provider>
