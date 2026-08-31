<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-2",
    interactive: false,
    responsive: true,
    title: "Alert example 2",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle, HugeiconsIcon } from "@coss-sv/ui";
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
</script>

<Alert>
  <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} /><AlertTitle>
    Heads up!
  </AlertTitle><AlertDescription>Describe what can be done about it here.</AlertDescription>
</Alert>
