<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-22",
  interactive: true,
  responsive: false,
  title: "Directional pad",
});
</script>

<script lang="ts">
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  CircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button } from "@coss-sv/ui";
</script>

<div class="inline-grid w-fit grid-cols-3 gap-1">
  <Button aria-label="Pan camera up" class="col-start-2" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={ArrowUp01Icon} strokeWidth={2} />
  </Button>
  <Button aria-label="Pan camera left" class="col-start-1" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} strokeWidth={2} />
  </Button>
  <div aria-hidden="true" class="flex items-center justify-center">
    <HugeiconsIcon class="size-4 opacity-80" icon={CircleIcon} strokeWidth={2} />
  </div>
  <Button aria-label="Pan camera right" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} />
  </Button>
  <Button aria-label="Pan camera down" class="col-start-2" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={ArrowDown01Icon} strokeWidth={2} />
  </Button>
</div>
