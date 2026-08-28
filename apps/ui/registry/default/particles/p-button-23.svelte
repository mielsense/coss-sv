<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-23",
  interactive: true,
  responsive: false,
  title: "Like button with count",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
import { ThumbsUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Button class="pe-0" variant="outline"
  ><HugeiconsIcon aria-hidden="true" icon={ThumbsUpIcon} strokeWidth={2} />Like<span
    class="relative ms-1 px-3 font-medium text-muted-foreground text-xs before:absolute before:inset-0 before:left-0 before:w-px before:bg-input"
    >86</span
  ></Button
>
