<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge"],
    id: "p-badge-11",
    interactive: false,
    responsive: false,
    title: "Badge with icon",
  });
</script>

<script lang="ts">
  import { Badge, HugeiconsIcon } from "@coss-sv/ui";
  import Tick01Icon from "@hugeicons/core-free-icons/Tick01Icon";
</script>

<Badge variant="outline">
  <HugeiconsIcon aria-hidden="true" icon={Tick01Icon} strokeWidth={2} />Verified
</Badge>
