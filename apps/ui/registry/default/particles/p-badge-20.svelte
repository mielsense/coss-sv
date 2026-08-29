<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-20",
    interactive: true,
    responsive: false,
    title: "Removable badge",
  });
</script>

<script lang="ts">
  import { Badge, HugeiconsIcon } from "@coss-sv/ui";
  import { Cancel01Icon } from "@hugeicons/core-free-icons";

  let active = $state(true);
</script>

{#if active}<Badge class="gap-0"
    >Removable<button
      class="-my-px -ms-px -me-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 text-primary-foreground/60 outline-none transition-[color,box-shadow] hover:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      onclick={() => (active = false)}
      type="button"><HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} /></button
    ></Badge
  >{/if}
