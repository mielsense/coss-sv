<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "kbd"],
    id: "p-button-31",
    interactive: true,
    responsive: false,
    title: "Print shortcut button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon, Kbd, KbdGroup } from "@coss-sv/ui";
  import PrinterIcon from "@hugeicons/core-free-icons/PrinterIcon";
</script>

<Button variant="outline">
  <HugeiconsIcon aria-hidden="true" icon={PrinterIcon} strokeWidth={2} />Print<KbdGroup
    class="-me-1"
  >
    <Kbd>&#8984;</Kbd><Kbd>P</Kbd>
  </KbdGroup>
</Button>
