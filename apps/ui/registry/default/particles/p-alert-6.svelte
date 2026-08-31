<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-6",
    interactive: false,
    responsive: true,
    title: "Alert example 6",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle, HugeiconsIcon } from "@coss-sv/ui";
  import Alert02Icon from "@hugeicons/core-free-icons/Alert02Icon";
</script>

<Alert variant="warning">
  <HugeiconsIcon aria-hidden="true" icon={Alert02Icon} strokeWidth={2} /><AlertTitle>
    Heads up!
  </AlertTitle><AlertDescription>Describe what can be done about it here.</AlertDescription>
</Alert>
