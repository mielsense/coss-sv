<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-7",
    interactive: false,
    responsive: true,
    title: "Alert example 7",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle, HugeiconsIcon } from "@coss-sv/ui";
  import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";
</script>

<Alert variant="error">
  <HugeiconsIcon aria-hidden="true" icon={AlertCircleIcon} strokeWidth={2} /><AlertTitle>
    Heads up!
  </AlertTitle><AlertDescription>Describe what can be done about it here.</AlertDescription>
</Alert>
