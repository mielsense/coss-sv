<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge", "checkbox"],
    id: "p-badge-19",
    interactive: true,
    responsive: false,
    title: "Selectable badge",
  });
</script>

<script lang="ts">
  import { Badge, Checkbox } from "@coss-sv/ui";
  import { Tick01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  const uid = $props.id();
  let checked = $state(true);
</script>

<Badge
  class="relative outline-none has-focus-visible:border-ring has-data-unchecked:bg-muted has-data-unchecked:text-muted-foreground has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
  ><Checkbox bind:checked class="peer hidden" id={uid} /><HugeiconsIcon
    aria-hidden="true"
    class="hidden peer-data-checked:block"
    icon={Tick01Icon}
    strokeWidth={2}
  /><label class="cursor-pointer select-none after:absolute after:inset-0" for={uid}
    >Selectable</label
  ></Badge
>
